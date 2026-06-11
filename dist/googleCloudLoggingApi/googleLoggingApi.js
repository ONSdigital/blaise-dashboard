"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLoggingApi = void 0;
const logging_1 = require("@google-cloud/logging");
function floorToUtcHour(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 0, 0, 0));
}
function toUtcHourKey(date) {
    return floorToUtcHour(date).toISOString();
}
function normalizeTimestamp(timestamp) {
    if (timestamp instanceof Date) {
        return timestamp.toISOString();
    }
    if (typeof timestamp === "string" && timestamp.trim().length > 0) {
        return timestamp;
    }
    if (typeof timestamp === "object" && timestamp !== null && "seconds" in timestamp) {
        const seconds = timestamp.seconds;
        if (typeof seconds === "number" && Number.isFinite(seconds)) {
            return new Date(seconds * 1000).toISOString();
        }
    }
    return new Date().toISOString();
}
function normalizeLogMessage(data) {
    if (typeof data === "string") {
        return data;
    }
    if (typeof data === "object" && data !== null) {
        const message = data.message;
        if (typeof message === "string" && message.trim().length > 0) {
            return message;
        }
        try {
            return JSON.stringify(data);
        }
        catch {
            return "Unparseable log payload";
        }
    }
    if (data === undefined || data === null) {
        return "";
    }
    return String(data);
}
class GoogleLoggingApi {
    projectId;
    logging;
    constructor(projectId) {
        this.projectId = projectId;
        this.logging = new logging_1.Logging({ projectId: this.projectId });
    }
    async getErrorLogsLast24Hours(scope) {
        const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString();
        const severityFilter = scope === "nisra" || scope === "bts" || scope === "restapi"
            ? "severity>=DEFAULT"
            : "severity>=ERROR";
        const scopeFilter = scope === "blaise"
            ? "jsonPayload.source_name=\"Blaise\""
            : scope === "nisra"
                ? "resource.labels.service_name=~\"^nisra-.*\""
                : scope === "bts"
                    ? "resource.labels.service_name=~\"^bts-.*\""
                    : scope === "restapi"
                        ? "jsonPayload.message=~\"^RESTAPI: .*\" AND jsonPayload.computer_name=~\"^restapi-.*\""
                        : "NOT jsonPayload.source_name=\"Blaise\"";
        const filter = `${severityFilter} AND timestamp>="${twentyFourHoursAgo}" AND ${scopeFilter}`;
        const entries = [];
        const seenPageTokens = new Set();
        let pageToken;
        let hasMorePages = true;
        while (hasMorePages) {
            const [pageEntries, nextQuery] = await this.logging.getEntries({
                autoPaginate: false,
                filter,
                orderBy: "timestamp desc",
                pageSize: 1000,
                pageToken
            });
            entries.push(...pageEntries);
            const nextPageToken = typeof nextQuery === "object"
                && nextQuery !== null
                && "pageToken" in nextQuery
                && typeof nextQuery.pageToken === "string"
                ? nextQuery.pageToken
                : undefined;
            if (!nextPageToken || seenPageTokens.has(nextPageToken)) {
                hasMorePages = false;
            }
            else {
                seenPageTokens.add(nextPageToken);
                pageToken = nextPageToken;
            }
        }
        return entries.map((entry) => {
            const typedEntry = entry;
            return {
                timestamp: normalizeTimestamp(typedEntry.metadata?.timestamp),
                log: normalizeLogMessage(typedEntry.data)
            };
        });
    }
    async getCawiSuccessfulLoginCountsLast24Hours() {
        const now = new Date();
        const currentHour = floorToUtcHour(now);
        const firstHour = new Date(currentHour.getTime() - (23 * 60 * 60 * 1000));
        const filter = [
            `timestamp>="${firstHour.toISOString()}"`,
            "resource.labels.module_id=\"cawi-portal\"",
            "jsonPayload.message=~\"^Successful auth with questionnaire: .*\""
        ].join(" AND ");
        const [entries] = await this.logging.getEntries({
            filter,
            orderBy: "timestamp asc",
            pageSize: 1000
        });
        const countsByHour = new Map();
        for (let i = 0; i < 24; i += 1) {
            const hour = new Date(firstHour.getTime() + (i * 60 * 60 * 1000));
            countsByHour.set(hour.toISOString(), 0);
        }
        entries.forEach((entry) => {
            const typedEntry = entry;
            const timestamp = normalizeTimestamp(typedEntry.metadata?.timestamp);
            const parsed = new Date(timestamp);
            if (Number.isNaN(parsed.getTime())) {
                return;
            }
            const hourKey = toUtcHourKey(parsed);
            if (!countsByHour.has(hourKey)) {
                return;
            }
            countsByHour.set(hourKey, countsByHour.get(hourKey) + 1);
        });
        return Array.from(countsByHour.entries()).map(([timestamp, count]) => ({
            timestamp,
            count
        }));
    }
}
exports.GoogleLoggingApi = GoogleLoggingApi;
//# sourceMappingURL=googleLoggingApi.js.map