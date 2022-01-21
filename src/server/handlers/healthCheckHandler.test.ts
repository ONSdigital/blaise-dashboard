import NewServer from "../server";
import supertest from "supertest";

import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config";
import NodeCache from "node-cache";

const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });

const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

const server = NewServer(blaiseApiClient, cache, config);
const request = supertest(server);

describe("Test Health Endpoint", () => {
    it("should return a 200 status and json message", async () => {
        const response = await request.get("/dashboard-ui/version/health");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toStrictEqual({ healthy: true });
    });
});
