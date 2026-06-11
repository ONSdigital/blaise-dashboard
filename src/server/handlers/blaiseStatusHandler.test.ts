import express from "express";
import supertest from "supertest";
import axios from "axios";
import { getBlaiseStatus } from "./blaiseStatusHandler";
import { Config } from "../config";

vi.mock("axios");

const mockedAxios = vi.mocked(axios, true);

const config: Config = {
    BlaiseApiUrl: "http://blaise-api.local",
    ServerPark: "gusty"
};

function buildApp() {
    const app = express();
    app.get("/api/health", async (req, res) => getBlaiseStatus(req, res, config));
    return app;
}

describe("Blaise Status Handler", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns Blaise status list from Blaise API", async () => {
        const responseBody = [
            { "health check type": "Connection model", status: "OK" },
            { "health check type": "Blaise connection", status: "OK" }
        ];

        mockedAxios.get.mockResolvedValue({ status: 200, data: responseBody } as never);
        const request = supertest(buildApp());

        const response = await request.get("/api/health");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(responseBody);
        expect(mockedAxios.get).toHaveBeenCalledWith("http://blaise-api.local/api/v1/health");
    });

    it("returns a 500 response when the request fails", async () => {
        mockedAxios.get.mockRejectedValue(new Error("timeout"));
        const request = supertest(buildApp());

        const response = await request.get("/api/health");

        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual({ message: "Unable to get Blaise status" });
    });
});