import { Logging } from "@google-cloud/logging";

export type GcpErrorLog = {
  timestamp: string;
  log: string;
};

export type CawiLoginCount = {
  timestamp: string;
  count: number;
};

export type ErrorLogScope =
  | "blaise"
  | "non-blaise"
  | "nisra"
  | "bts"
  | "restapi";

export interface GoogleErrorLogging {
  getErrorLogsLast24Hours(scope: ErrorLogScope): Promise<GcpErrorLog[]>;
  getCawiSuccessfulLoginCountsLast24Hours(): Promise<CawiLoginCount[]>;
}

function floorToUtcHour(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      0,
      0,
      0,
    ),
  );
}

function toUtcHourKey(date: Date): string {
  return floorToUtcHour(date).toISOString();
}

function normalizeTimestamp(timestamp: unknown): string {
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  if (typeof timestamp === "string" && timestamp.trim().length > 0) {
    return timestamp;
  }

  if (
    typeof timestamp === "object" &&
    timestamp !== null &&
    "seconds" in timestamp
  ) {
    const seconds = (timestamp as { seconds?: unknown }).seconds;
    if (typeof seconds === "number" && Number.isFinite(seconds)) {
      return new Date(seconds * 1000).toISOString();
    }
  }

  return new Date().toISOString();
}

function normalizeLogMessage(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }

    try {
      return JSON.stringify(data);
    } catch {
      return "Unparseable log payload";
    }
  }

  if (data === undefined || data === null) {
    return "";
  }

  return String(data);
}

export class GoogleLoggingApi implements GoogleErrorLogging {
  private readonly logging: Logging;
  private readonly cacheTtlMs = 60 * 1000;
  private readonly maxPageRequests = 3;
  private readonly errorLogsCache = new Map<
    ErrorLogScope,
    { expiresAt: number; data: GcpErrorLog[] }
  >();
  private cawiCountsCache: {
    expiresAt: number;
    data: CawiLoginCount[];
  } | null = null;

  constructor(public readonly projectId: string) {
    this.logging = new Logging({ projectId: this.projectId });
  }

  async getErrorLogsLast24Hours(scope: ErrorLogScope): Promise<GcpErrorLog[]> {
    const cached = this.errorLogsCache.get(scope);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const severityFilter =
      scope === "nisra" || scope === "bts" || scope === "restapi"
        ? "severity>=DEFAULT"
        : "severity>=ERROR";
    const scopeFilter =
      scope === "blaise"
        ? 'jsonPayload.source_name="Blaise"'
        : scope === "nisra"
          ? 'resource.labels.service_name=~"^nisra-.*"'
          : scope === "bts"
            ? 'resource.labels.service_name=~"^bts-.*"'
            : scope === "restapi"
              ? 'jsonPayload.message=~"^RESTAPI: .*" AND jsonPayload.computer_name=~"^restapi-.*"'
              : 'NOT jsonPayload.source_name="Blaise"';
    const filter = `${severityFilter} AND timestamp>="${twentyFourHoursAgo}" AND ${scopeFilter}`;

    const entries: unknown[] = [];
    const seenPageTokens = new Set<string>();
    let pageToken: string | undefined;
    let hasMorePages = true;
    let pageRequestCount = 0;

    while (hasMorePages && pageRequestCount < this.maxPageRequests) {
      pageRequestCount += 1;
      const [pageEntries, nextQuery] = await this.logging.getEntries({
        autoPaginate: false,
        filter,
        orderBy: "timestamp desc",
        pageSize: 1000,
        pageToken,
      });

      entries.push(...pageEntries);

      const nextPageToken =
        typeof nextQuery === "object" &&
        nextQuery !== null &&
        "pageToken" in nextQuery &&
        typeof (nextQuery as { pageToken?: unknown }).pageToken === "string"
          ? (nextQuery as { pageToken: string }).pageToken
          : undefined;

      if (!nextPageToken || seenPageTokens.has(nextPageToken)) {
        hasMorePages = false;
      } else {
        seenPageTokens.add(nextPageToken);
        pageToken = nextPageToken;
      }
    }

    const logs = entries.map((entry) => {
      const typedEntry = entry as unknown as {
        metadata?: { timestamp?: unknown };
        data?: unknown;
      };

      return {
        timestamp: normalizeTimestamp(typedEntry.metadata?.timestamp),
        log: normalizeLogMessage(typedEntry.data),
      };
    });

    this.errorLogsCache.set(scope, {
      expiresAt: Date.now() + this.cacheTtlMs,
      data: logs,
    });

    return logs;
  }

  async getCawiSuccessfulLoginCountsLast24Hours(): Promise<CawiLoginCount[]> {
    if (this.cawiCountsCache && this.cawiCountsCache.expiresAt > Date.now()) {
      return this.cawiCountsCache.data;
    }

    const now = new Date();
    const currentHour = floorToUtcHour(now);
    const firstHour = new Date(currentHour.getTime() - 23 * 60 * 60 * 1000);
    const filter = [
      `timestamp>="${firstHour.toISOString()}"`,
      'resource.labels.module_id="cawi-portal"',
      'jsonPayload.message=~"^Successful auth with questionnaire: .*"',
    ].join(" AND ");

    const [entries] = await this.logging.getEntries({
      filter,
      orderBy: "timestamp asc",
      pageSize: 1000,
    });

    const countsByHour = new Map<string, number>();
    for (let i = 0; i < 24; i += 1) {
      const hour = new Date(firstHour.getTime() + i * 60 * 60 * 1000);
      countsByHour.set(hour.toISOString(), 0);
    }

    entries.forEach((entry) => {
      const typedEntry = entry as unknown as {
        metadata?: { timestamp?: unknown };
      };
      const timestamp = normalizeTimestamp(typedEntry.metadata?.timestamp);
      const parsed = new Date(timestamp);
      if (Number.isNaN(parsed.getTime())) {
        return;
      }

      const hourKey = toUtcHourKey(parsed);
      if (!countsByHour.has(hourKey)) {
        return;
      }

      countsByHour.set(hourKey, countsByHour.get(hourKey)! + 1);
    });

    const counts = Array.from(countsByHour.entries()).map(
      ([timestamp, count]) => ({
        timestamp,
        count,
      }),
    );

    this.cawiCountsCache = {
      expiresAt: Date.now() + this.cacheTtlMs,
      data: counts,
    };

    return counts;
  }
}
