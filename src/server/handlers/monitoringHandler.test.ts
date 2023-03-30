import NewServer from "../server";
import supertest, { Response } from "supertest";
import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config";
import NodeCache from "node-cache";

jest.mock("../googleCloudMonitoringApi/monitoring");
import { getMonitoringUptimeCheckTimeSeries } from "../googleCloudMonitoringApi/monitoring";
import { mockHealthCheckList } from "../blaiseApi/testFixtures";
import { MonitoringDataModel } from "../monitoringDataModel";

const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);


const server = NewServer(blaiseApiClient, cache, config);
const request = supertest(server);

const getMonitoringUptimeCheckTimeSeriesMock = getMonitoringUptimeCheckTimeSeries as jest.Mock<Promise<MonitoringDataModel[]>>;

describe("Get all uptime checks from API", () => {
    
    it("should return a 200 status and a json list of 1 items when API returns a 1 item list", async () => {
        getMonitoringUptimeCheckTimeSeriesMock.mockReturnValue(Promise.resolve(mockHealthCheckList));
        const response = await request.get("/api/monitoring");
        expect(response.status).toEqual(200); 
        expect(response.body).toEqual(mockHealthCheckList);
    });

    it("should return a 500 status direct from the API", async () => {
        getMonitoringUptimeCheckTimeSeriesMock.mockImplementation(() => Promise.reject("Error getting uptime checks"));
        const response = await request.get("/api/monitoring");
        expect(response.status).toEqual(500); 
        expect(response.body).toEqual("Failed to get monitoring uptimeChecks config data");
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        cache.flushAll();
    });
});
