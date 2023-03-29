import NewServer from "../server";
import supertest, { Response } from "supertest";
import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config";
import NodeCache from "node-cache";

import monitoring from "@google-cloud/monitoring";
jest.mock("@google-cloud/monitoring");

const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);


const server = NewServer(blaiseApiClient, cache, config);
const request = supertest(server);


describe("Get all uptime checks from API", () => {
    beforeAll(() => {
        monitoring.UptimeCheckServiceClient.mockImplementation(()=> ({
            listUptimeCheckConfigs: jest.fn(() => Promise.resolve([]))

        }))
    });
    afterEach(() => {
        cache.flushAll();
    });

    // it("should return a 200 status and a json list of 1 items when API returns a 1 item list", async () => {
       
    //     mock.onGet("/api/monitoring").reply(200, mockHealthCheckList);
    //     const [success,data] = await getMonitoring();
    //     expect(success).toBeTruthy();
    //     expect(data).toEqual(data);

    //     //expect(response.status).toEqual(200);
    // });

    it("test monitoring api", async () => {
        const response = await request.get("/api/monitoring");
        expect(response.status).toEqual(200);  
    });

    // it("should return a 500 status direct from the API", async () => {
    //    // getQuestionnairesMock.mockRejectedValue(null);

    //     const response: Response = await request.get("/api/monitoring");

    //     expect(response.status).toEqual(400);
    // });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });
});
