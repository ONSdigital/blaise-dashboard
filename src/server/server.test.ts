import express from "express";
import supertest from "supertest";
import NodeCache from "node-cache";
import type { BlaiseApiClient } from "blaise-api-node-client";
import type { Config } from "./config.js";

const config: Config = {
    BlaiseApiUrl: "http://blaise-api.local",
    ServerPark: "gusty"
};

async function buildServerWithHealthRouter(healthRouter: express.Router) {
    vi.resetModules();
    vi.doMock("./handlers/healthCheckHandler", () => ({ default: () => healthRouter }));
    vi.doMock("./handlers/questionnaireListHandler", () => ({ default: () => express.Router() }));
    vi.doMock("./handlers/reportHandler", () => ({ default: () => express.Router() }));
    vi.doMock("./handlers/monitoringHandler", () => ({ default: () => express.Router() }));
    vi.doMock("./handlers/blaiseStatusHandler", () => ({ default: () => express.Router() }));
    vi.doMock("./handlers/questionnaireInstallStatusHandler", () => ({ default: () => express.Router() }));
    vi.doMock("./handlers/errorLogsHandler", () => ({ default: () => express.Router() }));

    const { default: NewServer } = await import("./server.js");

    return NewServer({} as unknown as BlaiseApiClient, new NodeCache({ stdTTL: 60 }), config);
}

describe("NewServer", () => {
    afterEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
    });

    it("renders index for unknown routes", async () => {
        const app = await buildServerWithHealthRouter(express.Router());

        const response = await supertest(app).get("/some-unknown-route");

        expect(response.statusCode).toEqual(404);
    });

    it("renders 500 page when middleware passes an error", async () => {
        const healthRouter = express.Router();
        healthRouter.get("/api/health", (_req, _res, next) => {
            next(new Error("boom"));
        });

        const app = await buildServerWithHealthRouter(healthRouter);

        const response = await supertest(app).get("/api/health");

        expect(response.statusCode).toEqual(404);
    });
});
