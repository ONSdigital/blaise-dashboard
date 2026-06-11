import {getMonitoringUptimeCheckTimeSeries} from "./monitoring.js";

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

    it("should return error statuses for false bool values", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            () => Promise.resolve(
                [
                    {points: [{value: {boolValue: false}}]}
                ]
            )
        );

        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([
            {
                "hostname": "example-host",
                "regions": [
                    {"region": "eur-belgium", "status": "error"},
                    {"region": "apac-singapore", "status": "error"},
                    {"region": "usa-oregon", "status": "error"},
                    {"region": "sa-brazil-sao_paulo", "status": "error"}
                ]
            }
        ]);
    });

    it("should return success statuses for numeric uptime values", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            () => Promise.resolve(
                [
                    {points: [{value: {doubleValue: 1}}]}
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

    it("should return error statuses for numeric uptime values below one", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockResolvedValue(
            [
                {points: [{value: {doubleValue: 0}}]}
            ]
        );

        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([
            {
                "hostname": "example-host",
                "regions": [
                    {"region": "eur-belgium", "status": "error"},
                    {"region": "apac-singapore", "status": "error"},
                    {"region": "usa-oregon", "status": "error"},
                    {"region": "sa-brazil-sao_paulo", "status": "error"}
                ]
            }
        ]);
    });

    it("should return success statuses for int64 uptime values", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            () => Promise.resolve(
                [
                    {points: [{value: {int64Value: "1"}}]}
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

    it("should return error statuses for int64 zero values", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            () => Promise.resolve(
                [
                    {points: [{value: {int64Value: "0"}}]}
                ]
            )
        );

        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([
            {
                "hostname": "example-host",
                "regions": [
                    {"region": "eur-belgium", "status": "error"},
                    {"region": "apac-singapore", "status": "error"},
                    {"region": "usa-oregon", "status": "error"},
                    {"region": "sa-brazil-sao_paulo", "status": "error"}
                ]
            }
        ]);
    });


    it("should return requestFailed statuses when no time series points are returned", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            () => Promise.resolve(
                [
                    {points: []}
                ]
            )
        );
        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([{"hostname": "example-host", 
            "regions": 
            [{"region": "eur-belgium", "status": "requestFailed"}, 
            {"region": "apac-singapore", "status": "requestFailed"}, 
            {"region": "usa-oregon", "status": "requestFailed"}, 
            {"region": "sa-brazil-sao_paulo", "status": "requestFailed"}]
        }]);
    });

    it("should return requestFailed statuses when points are undefined", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockResolvedValue(
            [
                {}
            ]
        );

        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([{
            "hostname": "example-host",
            "regions": [
                {"region": "eur-belgium", "status": "requestFailed"},
                {"region": "apac-singapore", "status": "requestFailed"},
                {"region": "usa-oregon", "status": "requestFailed"},
                {"region": "sa-brazil-sao_paulo", "status": "requestFailed"}
            ]
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

    it("should return requestFailed statuses for unknown point value shapes", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: "example-host"}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockResolvedValue(
            [
                {points: [{value: {stringValue: "unknown"}}]}
            ]
        );

        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);

        expect(result).toEqual([{
            "hostname": "example-host",
            "regions": [
                {"region": "eur-belgium", "status": "requestFailed"},
                {"region": "apac-singapore", "status": "requestFailed"},
                {"region": "usa-oregon", "status": "requestFailed"},
                {"region": "sa-brazil-sao_paulo", "status": "requestFailed"}
            ]
        }]);
    });

     afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });
});