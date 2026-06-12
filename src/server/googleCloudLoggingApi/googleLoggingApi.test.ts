const getEntriesMock = vi.hoisted(() => vi.fn());
const loggingConstructorMock = vi.hoisted(() => vi.fn());

vi.mock("@google-cloud/logging", () => ({
  Logging: vi.fn(function MockLogging(config: unknown) {
    loggingConstructorMock(config);
    return {
      getEntries: getEntriesMock,
    };
  }),
}));

import { GoogleLoggingApi, type ErrorLogScope } from "./googleLoggingApi.js";

describe("GoogleLoggingApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds the expected scope filters", async () => {
    getEntriesMock.mockResolvedValue([[], undefined]);
    const api = new GoogleLoggingApi("test-project");

    const scenarios: Array<{
      scope: ErrorLogScope;
      expected: string;
      severity: string;
    }> = [
      {
        scope: "blaise",
        expected: 'jsonPayload.source_name="Blaise"',
        severity: "severity>=ERROR",
      },
      {
        scope: "non-blaise",
        expected: 'NOT jsonPayload.source_name="Blaise"',
        severity: "severity>=ERROR",
      },
      {
        scope: "nisra",
        expected: 'resource.labels.service_name=~"^nisra-.*"',
        severity: "severity>=DEFAULT",
      },
      {
        scope: "bts",
        expected: 'resource.labels.service_name=~"^bts-.*"',
        severity: "severity>=DEFAULT",
      },
      {
        scope: "restapi",
        expected:
          'jsonPayload.message=~"^RESTAPI: .*" AND jsonPayload.computer_name=~"^restapi-.*"',
        severity: "severity>=DEFAULT",
      },
    ];

    for (const scenario of scenarios) {
      await api.getErrorLogsLast24Hours(scenario.scope);
      const request = getEntriesMock.mock.calls.at(-1)?.[0] as {
        filter: string;
      };
      expect(request.filter).toContain(scenario.expected);
      expect(request.filter).toContain(scenario.severity);
    }
  });

  it("paginates and normalizes error log entries", async () => {
    vi.spyOn(Date, "now").mockReturnValue(
      new Date("2026-06-11T12:00:00.000Z").getTime(),
    );

    const circular: Record<string, unknown> = {};
    circular.self = circular;

    getEntriesMock
      .mockResolvedValueOnce([
        [
          {
            metadata: { timestamp: new Date("2026-06-11T10:00:00.000Z") },
            data: { message: "Log 1" },
          },
          {
            metadata: { timestamp: "2026-06-11T09:00:00.000Z" },
            data: { foo: "bar" },
          },
        ],
        { pageToken: "next-1" },
      ])
      .mockResolvedValueOnce([
        [
          { metadata: { timestamp: { seconds: 1718100000 } }, data: circular },
          {
            metadata: { timestamp: { seconds: Number.NaN } },
            data: "Fallback timestamp",
          },
          {
            metadata: { timestamp: "2026-06-11T08:00:00.000Z" },
            data: "Raw string message",
          },
          { metadata: { timestamp: "2026-06-11T07:00:00.000Z" }, data: 42 },
          { metadata: {}, data: null },
        ],
        { pageToken: "next-1" },
      ]);

    const api = new GoogleLoggingApi("test-project");
    const result = await api.getErrorLogsLast24Hours("restapi");

    expect(result).toHaveLength(7);
    expect(result.slice(0, 3)).toEqual([
      { timestamp: "2026-06-11T10:00:00.000Z", log: "Log 1" },
      { timestamp: "2026-06-11T09:00:00.000Z", log: '{"foo":"bar"}' },
      { timestamp: "2024-06-11T10:00:00.000Z", log: "Unparseable log payload" },
    ]);
    expect(result[3].log).toEqual("Fallback timestamp");
    expect(Number.isNaN(new Date(result[3].timestamp).getTime())).toBeFalsy();
    expect(result[4]).toEqual({
      timestamp: "2026-06-11T08:00:00.000Z",
      log: "Raw string message",
    });
    expect(result[5]).toEqual({
      timestamp: "2026-06-11T07:00:00.000Z",
      log: "42",
    });
    expect(result[6].log).toEqual("");
    expect(Number.isNaN(new Date(result[6].timestamp).getTime())).toBeFalsy();

    expect(getEntriesMock).toHaveBeenCalledTimes(2);
    expect(getEntriesMock.mock.calls[0][0]).toMatchObject({
      autoPaginate: false,
      orderBy: "timestamp desc",
      pageSize: 1000,
    });
    expect(getEntriesMock.mock.calls[1][0]).toMatchObject({
      pageToken: "next-1",
    });
  });

  it("aggregates CAWI successful login counts for the last 24 hours", async () => {
    vi.spyOn(Date, "now").mockReturnValue(
      new Date("2026-06-11T12:30:00.000Z").getTime(),
    );

    const t1 = new Date("2026-06-11T12:10:00.000Z");
    const t2 = new Date("2026-06-11T12:20:00.000Z");

    getEntriesMock.mockResolvedValueOnce([
      [
        { metadata: { timestamp: t1 } },
        {
          metadata: { timestamp: { seconds: Math.floor(t2.getTime() / 1000) } },
        },
        { metadata: { timestamp: "invalid" } },
        { metadata: { timestamp: "3026-06-12T00:00:00.000Z" } },
      ],
      undefined,
    ]);

    const api = new GoogleLoggingApi("test-project");
    const result = await api.getCawiSuccessfulLoginCountsLast24Hours();

    expect(result).toHaveLength(24);
    expect(
      result.find((point) => point.timestamp === "2026-06-11T12:00:00.000Z")
        ?.count,
    ).toEqual(2);
    expect(
      result.find((point) => point.timestamp === "2026-06-11T11:00:00.000Z")
        ?.count,
    ).toEqual(0);

    const request = getEntriesMock.mock.calls[0][0] as {
      filter: string;
      orderBy: string;
      pageSize: number;
    };
    expect(request.filter).toContain('resource.labels.module_id="cawi-portal"');
    expect(request.filter).toContain(
      'jsonPayload.message=~"^Successful auth with questionnaire: .*"',
    );
    expect(request.orderBy).toEqual("timestamp asc");
    expect(request.pageSize).toEqual(1000);
  });

  it("constructs Logging with the provided project id", () => {
    new GoogleLoggingApi("project-abc");
    expect(loggingConstructorMock).toHaveBeenCalledWith({
      projectId: "project-abc",
    });
  });

  it("returns cached error logs for repeated calls within cache TTL", async () => {
    getEntriesMock.mockResolvedValueOnce([
      [{ metadata: { timestamp: "2026-06-11T10:00:00.000Z" }, data: "Log 1" }],
      undefined,
    ]);

    const api = new GoogleLoggingApi("test-project");

    const first = await api.getErrorLogsLast24Hours("restapi");
    const second = await api.getErrorLogsLast24Hours("restapi");

    expect(first).toEqual(second);
    expect(getEntriesMock).toHaveBeenCalledTimes(1);
  });

  it("returns cached CAWI login counts for repeated calls within cache TTL", async () => {
    vi.spyOn(Date, "now").mockReturnValue(
      new Date("2026-06-11T12:30:00.000Z").getTime(),
    );

    getEntriesMock.mockResolvedValueOnce([[], undefined]);
    const api = new GoogleLoggingApi("test-project");

    const first = await api.getCawiSuccessfulLoginCountsLast24Hours();
    const second = await api.getCawiSuccessfulLoginCountsLast24Hours();

    expect(first).toEqual(second);
    expect(getEntriesMock).toHaveBeenCalledTimes(1);
  });
});
