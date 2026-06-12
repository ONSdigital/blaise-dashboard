const uptimeProjectPathMock = vi.hoisted(() => vi.fn());
const listUptimeCheckConfigsMock = vi.hoisted(() => vi.fn());
const metricProjectPathMock = vi.hoisted(() => vi.fn());
const listTimeSeriesMock = vi.hoisted(() => vi.fn());

vi.mock("@google-cloud/monitoring", () => ({
  UptimeCheckServiceClient: vi.fn(function MockUptimeCheckServiceClient() {
    return {
      projectPath: uptimeProjectPathMock,
      listUptimeCheckConfigs: listUptimeCheckConfigsMock,
    };
  }),
  MetricServiceClient: vi.fn(function MockMetricServiceClient() {
    return {
      projectPath: metricProjectPathMock,
      listTimeSeries: listTimeSeriesMock,
    };
  }),
}));

import { GoogleMonitoringApi } from "./googleMonitoringApi.js";
import logger from "../logger.js";

describe("GoogleMonitoringApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uptimeProjectPathMock.mockReturnValue("projects/test-project");
    metricProjectPathMock.mockReturnValue("projects/test-project");
  });

  it("returns uptime check configs", async () => {
    listUptimeCheckConfigsMock.mockResolvedValue([
      [{ displayName: "uptime-check" }],
    ]);
    const api = new GoogleMonitoringApi("test-project");

    const result = await api.getUptimeChecksConfigs();

    expect(result).toEqual([{ displayName: "uptime-check" }]);
    expect(uptimeProjectPathMock).toHaveBeenCalledWith("test-project");
    expect(listUptimeCheckConfigsMock).toHaveBeenCalledWith({
      parent: "projects/test-project",
    });
  });

  it("rethrows uptime config errors", async () => {
    listUptimeCheckConfigsMock.mockRejectedValue(new Error("denied"));
    const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => logger);
    const api = new GoogleMonitoringApi("test-project");

    await expect(api.getUptimeChecksConfigs()).rejects.toThrow("denied");
    expect(errorSpy).toHaveBeenCalledWith(
      { error: expect.any(Error) },
      "Failed to get uptime check configs",
    );
  });

  it("lists timeseries points", async () => {
    listTimeSeriesMock.mockResolvedValue([[{ metric: { type: "t" } }]]);
    const api = new GoogleMonitoringApi("test-project");

    const result = await api.listTimeSeries("metric.filter", 10, 20);

    expect(result).toEqual([{ metric: { type: "t" } }]);
    expect(metricProjectPathMock).toHaveBeenCalledWith("test-project");
    expect(listTimeSeriesMock).toHaveBeenCalledWith({
      name: "projects/test-project",
      filter: "metric.filter",
      interval: {
        startTime: { seconds: 10 },
        endTime: { seconds: 20 },
      },
    });
  });
});
