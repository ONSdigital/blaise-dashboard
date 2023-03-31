import NewServer from "../server";
import supertest from "supertest";
import BlaiseApiClient from "blaise-api-node-client";
import {GetConfigFromEnv} from "../config";
import NodeCache from "node-cache";
import {getMonitoringUptimeCheckTimeSeries} from "../googleCloudMonitoringApi/monitoring";
import { GoogleMonitoringApi } from "../googleCloudMonitoringApi/googleMonitoringApi";
import {mockHealthCheckList} from "../blaiseApi/testFixtures";
import {MonitoringDataModel} from "../monitoringDataModel";

const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);
jest.mock("../googleCloudMonitoringApi/monitoring", () => {
    const original = jest.requireActual("../googleCloudMonitoringApi/monitoring");
    return {
        ...original,
        getMonitoringUptimeCheckTimeSeries: jest.fn()
    };
});

const getMonitoringUptimeCheckTimeSeriesMock = getMonitoringUptimeCheckTimeSeries as jest.Mock<Promise<MonitoringDataModel[]>>;

describe("Get all uptime checks from API", () => {
    
    it("should return a 200 status and a json list of 1 items when API returns a 1 item list", async () => {
        process.env.GOOGLE_CLOUD_PROJECT = "example-project-id";
        getMonitoringUptimeCheckTimeSeriesMock.mockReturnValue(Promise.resolve(mockHealthCheckList));

        const server = NewServer(blaiseApiClient, cache, config);
        const request = supertest(server);
        const response = await request.get("/api/monitoring");

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(mockHealthCheckList);
        const [googleMonitoringApi] = getMonitoringUptimeCheckTimeSeriesMock.mock.calls[0] as GoogleMonitoringApi[];
        expect(googleMonitoringApi.projectId).toEqual("example-project-id");
    });

    it("should return a 500 status direct from the API", async () => {
        getMonitoringUptimeCheckTimeSeriesMock.mockImplementation(() => Promise.reject("Error getting uptime checks"));

        const server = NewServer(blaiseApiClient, cache, config);
        const request = supertest(server);
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