import NewServer from "../server.js";
import supertest from "supertest";
import { BlaiseApiClient } from "blaise-api-node-client";
import {GetConfigFromEnv} from "../config.js";
import NodeCache from "node-cache";
import {getMonitoringUptimeCheckTimeSeries} from "../googleCloudMonitoringApi/monitoring.js";
import { GoogleMonitoringApi } from "../googleCloudMonitoringApi/googleMonitoringApi.js";
import {mockHealthCheckList} from "../blaiseApi/testFixtures.js";

const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);
vi.mock("../googleCloudMonitoringApi/monitoring", async (importOriginal) => {
    const original = await importOriginal<typeof import("../googleCloudMonitoringApi/monitoring.js")>();
    return {
        ...original,
        getMonitoringUptimeCheckTimeSeries: vi.fn()
    };
});

const getMonitoringUptimeCheckTimeSeriesMock = vi.mocked(getMonitoringUptimeCheckTimeSeries);

describe("Get all uptime checks from API", () => {
    
    it("should return a 200 status and a json list of 1 items when API returns a 1 item list", async () => {
        process.env.PROJECT_ID = "example-project-id";
        getMonitoringUptimeCheckTimeSeriesMock.mockReturnValue(Promise.resolve(mockHealthCheckList));

        const server = NewServer(blaiseApiClient, cache, config);
        const request = supertest(server);
        const response = await request.get("/api/monitoring");

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(mockHealthCheckList);
        const [googleMonitoringApi] = getMonitoringUptimeCheckTimeSeriesMock.mock.calls[0] ?? [];
        expect(googleMonitoringApi).toBeInstanceOf(GoogleMonitoringApi);
        if (!googleMonitoringApi || !("projectId" in googleMonitoringApi)) {
            throw new Error("Expected monitoring API instance with projectId");
        }
        expect(googleMonitoringApi.projectId).toEqual("example-project-id");
    });

    it("should return a 500 status direct from the API", async () => {
        getMonitoringUptimeCheckTimeSeriesMock.mockImplementation(() => Promise.reject("Error getting uptime checks"));

        const server = NewServer(blaiseApiClient, cache, config);
        const request = supertest(server);
        const response = await request.get("/api/monitoring");
        expect(response.status).toEqual(500);
        expect(response.body).toEqual("Failed to get monitoring uptimeChecks config data: Error getting uptime checks");
    });

    it("should return a 500 status with Error.message when API throws an Error", async () => {
        getMonitoringUptimeCheckTimeSeriesMock.mockImplementation(() => Promise.reject(new Error("monitoring down")));

        const server = NewServer(blaiseApiClient, cache, config);
        const request = supertest(server);
        const response = await request.get("/api/monitoring");

        expect(response.status).toEqual(500);
        expect(response.body).toEqual("Failed to get monitoring uptimeChecks config data: monitoring down");
    });

    it("should use GOOGLE_CLOUD_PROJECT when PROJECT_ID is not set", async () => {
        delete process.env.PROJECT_ID;
        process.env.GOOGLE_CLOUD_PROJECT = "fallback-project-id";
        getMonitoringUptimeCheckTimeSeriesMock.mockReturnValue(Promise.resolve(mockHealthCheckList));

        const server = NewServer(blaiseApiClient, cache, config);
        const request = supertest(server);
        const response = await request.get("/api/monitoring");

        expect(response.status).toEqual(200);
        const [googleMonitoringApi] = getMonitoringUptimeCheckTimeSeriesMock.mock.calls[0] ?? [];
        expect(googleMonitoringApi).toBeInstanceOf(GoogleMonitoringApi);
        if (!googleMonitoringApi || !("projectId" in googleMonitoringApi)) {
            throw new Error("Expected monitoring API instance with projectId");
        }
        expect(googleMonitoringApi.projectId).toEqual("fallback-project-id");
    });

    it("should return a clear error when no project ID env var exists", async () => {
        delete process.env.PROJECT_ID;
        delete process.env.GOOGLE_CLOUD_PROJECT;
        delete process.env.GCLOUD_PROJECT;

        const server = NewServer(blaiseApiClient, cache, config);
        const request = supertest(server);
        const response = await request.get("/api/monitoring");

        expect(response.status).toEqual(500);
        expect(response.body).toEqual("Monitoring project ID is not configured");
        expect(getMonitoringUptimeCheckTimeSeriesMock).not.toHaveBeenCalled();
    });

    it("should use GCLOUD_PROJECT when PROJECT_ID and GOOGLE_CLOUD_PROJECT are not set", async () => {
        delete process.env.PROJECT_ID;
        delete process.env.GOOGLE_CLOUD_PROJECT;
        process.env.GCLOUD_PROJECT = "gcloud-project-id";
        getMonitoringUptimeCheckTimeSeriesMock.mockReturnValue(Promise.resolve(mockHealthCheckList));

        const server = NewServer(blaiseApiClient, cache, config);
        const request = supertest(server);
        const response = await request.get("/api/monitoring");

        expect(response.status).toEqual(200);
        const [googleMonitoringApi] = getMonitoringUptimeCheckTimeSeriesMock.mock.calls[0] ?? [];
        expect(googleMonitoringApi).toBeInstanceOf(GoogleMonitoringApi);
        if (!googleMonitoringApi || !("projectId" in googleMonitoringApi)) {
            throw new Error("Expected monitoring API instance with projectId");
        }
        expect(googleMonitoringApi.projectId).toEqual("gcloud-project-id");
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
        cache.flushAll();
    });
});