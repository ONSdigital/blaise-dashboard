import {getMonitoringUptimeCheckTimeSeries} from "./monitoring";

const mockGoogleMonitoring = {
    getUptimeChecksConfigs: vi.fn(),
    listTimeSeries: vi.fn(),
};

describe("Get all uptime checks from API", () => {
    it("should propagate getUptimeChecksConfigs errors", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockRejectedValue(new Error("boom"));

        await expect(getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring)).rejects.toThrow("boom");
    });

    it("should return success statuses", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            ()=> Promise.resolve(
                [
                    {points: [{value: {boolValue: true}}]}
                ]
            )
        );
        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([
            {
                "hostname": "example-host",
                "regions": [
                    {"region": "eur-belgium", "status": "success"},
                    {"region": "apac-singapore", "status": "success"},
                    {"region": "usa-oregon", "status": "success"},
                    {"region": "sa-brazil-sao_paulo", "status": "success"}
                ]
            }
        ]);
    });


    it("should return error statuses if coudnt get valid time series points", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            () => Promise.resolve(
                [
                    "Failed to get time series points"
                ]
            )
        );
        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([{"hostname": "example-host", 
            "regions": 
            [{"region": "eur-belgium", "status": "error"}, 
            {"region": "apac-singapore", "status": "error"}, 
            {"region": "usa-oregon", "status": "error"}, 
            {"region": "sa-brazil-sao_paulo", "status": "error"}]
        }]);
    });

    it("should skip configs without hostname labels", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: null}}} ]
        );

        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([]);
        expect(mockGoogleMonitoring.listTimeSeries).toHaveBeenCalledTimes(0);
    });

    it("should return requestFailed statuses if coudnt get time series points for any other reason", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            () => Promise.resolve([null])
        );
        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([{"hostname": "example-host", 
            "regions": 
            [{"region": "eur-belgium", "status": "requestFailed"}, 
            {"region": "apac-singapore", "status": "requestFailed"}, 
            {"region": "usa-oregon", "status": "requestFailed"}, 
            {"region": "sa-brazil-sao_paulo", "status": "requestFailed"}]}
        ]);
    });

     afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });
});