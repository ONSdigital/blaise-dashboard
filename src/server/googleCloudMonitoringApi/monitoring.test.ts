import {getMonitoringUptimeCheckTimeSeries} from "./monitoring";

const mockGoogleMonitoring = {
    getUptimeChecksConfigs: jest.fn(),
    listTimeSeries: jest.fn(),
};

describe("Get all uptime checks from API", () => {
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

    it("should return error statuses if coudnt get time series points for wrong hostname provided", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockResolvedValue(
            [{monitoredResource: {labels: {host: null}}} ]
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            () => Promise.resolve(
                [
                    "Failed to get time series points"
                ]
            )
        );
        const result = await getMonitoringUptimeCheckTimeSeries(mockGoogleMonitoring);
        expect(result).toEqual([{"hostname": null, 
            "regions": 
            [{"region": "eur-belgium", "status": "error"}, 
            {"region": "apac-singapore", "status": "error"}, 
            {"region": "usa-oregon", "status": "error"}, 
            {"region": "sa-brazil-sao_paulo", "status": "error"}]
        }]);
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
        jest.clearAllMocks();
        jest.resetModules();
    });
});