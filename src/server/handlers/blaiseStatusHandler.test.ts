import express from "express";
import supertest from "supertest";
import { getBlaiseStatus } from "./blaiseStatusHandler";
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

    it("returns a 500 response when the request fails", async () => {
        mockGetDiagnostics.mockRejectedValue(new Error("timeout"));
        const request = supertest(buildApp());

        const response = await request.get("/api/health");

        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual({ message: "Unable to get Blaise status" });
    });
});