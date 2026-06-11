import express from "express";
import supertest from "supertest";
import { getBlaiseStatus } from "./blaiseStatusHandler.js";
import BlaiseStatusHandler from "./blaiseStatusHandler.js";
import { BlaiseApiClient, Diagnostic } from "blaise-api-node-client";

const mockGetDiagnostics = vi.fn();
const blaiseApiClient = { getDiagnostics: mockGetDiagnostics } as unknown as BlaiseApiClient;

function buildApp() {
    const app = express();
    app.get("/api/health", async (req, res) => getBlaiseStatus(req, res, blaiseApiClient));
    return app;
}

describe("Blaise Status Handler", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns Blaise status list from Blaise API", async () => {
        const diagnostics: Diagnostic[] = [
            { healthCheckType: "Connection model", status: "OK" },
            { healthCheckType: "Blaise connection", status: "OK" }
        ];

        mockGetDiagnostics.mockResolvedValue(diagnostics);
        const request = supertest(buildApp());

        const response = await request.get("/api/health");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([
            { "health check type": "Connection model", status: "OK" },
            { "health check type": "Blaise connection", status: "OK" }
        ]);
        expect(mockGetDiagnostics).toHaveBeenCalled();
    });

    it("handles spaced health check type key and fallback labels", async () => {
        const diagnostics = [
            { "health check type": "Connection model", status: "OK" },
            { status: "OK" }
        ] as unknown as Diagnostic[];

        mockGetDiagnostics.mockResolvedValue(diagnostics);
        const request = supertest(buildApp());

        const response = await request.get("/api/health");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([
            { "health check type": "Connection model", status: "OK" },
            { "health check type": "Blaise connection", status: "OK" }
        ]);
    });

    it("uses derived health check type keys and unknown fallbacks", async () => {
        const diagnostics = [
            { Health_Check_Type: "Derived check", status: " " },
            { status: "OK" },
            { status: "OK" },
            { status: "OK" },
            { status: "OK" }
        ] as unknown as Diagnostic[];

        mockGetDiagnostics.mockResolvedValue(diagnostics);
        const request = supertest(buildApp());

        const response = await request.get("/api/health");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([
            { "health check type": "Derived check", status: "Unknown" },
            { "health check type": "Blaise connection", status: "OK" },
            { "health check type": "Remote data server connection", status: "OK" },
            { "health check type": "Remote Cati management connection", status: "OK" },
            { "health check type": "Unknown health check", status: "OK" }
        ]);
    });

    it("returns a 500 response when the request fails", async () => {
        mockGetDiagnostics.mockRejectedValue(new Error("timeout"));
        const request = supertest(buildApp());

        const response = await request.get("/api/health");

        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual({ message: "Unable to get Blaise status" });
    });

    it("default handler registers /api/health route", async () => {
        mockGetDiagnostics.mockResolvedValue([]);

        const app = express();
        app.use("/", BlaiseStatusHandler(blaiseApiClient));

        const response = await supertest(app).get("/api/health");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([]);
    });
});