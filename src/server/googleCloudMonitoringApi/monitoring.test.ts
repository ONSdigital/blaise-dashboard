import {getMonitoringUptimeCheckTimeSeries} from "./monitoring";

const mockGoogleMonitoring = {
    getUptimeChecksConfigs: jest.fn(),
    listTimeSeries: jest.fn(),
};

describe("Get all uptime checks from API", () => {

    it("should return success statuses", async () => {
        mockGoogleMonitoring.getUptimeChecksConfigs.mockReturnValue(
            Promise.resolve([
                {monitoredResource: {labels: {host: "example-host"}}}
            ])
        );
        mockGoogleMonitoring.listTimeSeries.mockImplementation(
            (filter, hostname, regionMonitored) => Promise.resolve(
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

    // TODO: write more tests

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();

    });
});
