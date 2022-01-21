import NewServer from "../server";
import supertest, { Response } from "supertest";
import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config";

const config = GetConfigFromEnv();
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

const { InstrumentListMockObject } = jest.requireActual("blaise-api-node-client");
const server = NewServer(blaiseApiClient, config);
const request = supertest(server);


import { getInstruments } from "../blaiseApi/instrument";
jest.mock("../blaiseApi/instrument");
const getInstrumentsMock = getInstruments as jest.MockedFunction<typeof getInstruments>;


describe("BlaiseAPI Get all instruments from API", () => {
    afterEach(() => {
        getInstrumentsMock.mockClear();
    });

    it("should return a 200 status and a json list of 3 items when API returns a 3 item list", async () => {
        getInstrumentsMock.mockReturnValue(InstrumentListMockObject);

        const response: Response = await request.get("/api/instruments");

        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual(InstrumentListMockObject);
        expect(response.body.length).toStrictEqual(3);
    });

    it("should return a 500 status direct from the API", async () => {
        getInstrumentsMock.mockRejectedValue(null);

        const response: Response = await request.get("/api/instruments");

        expect(response.status).toEqual(500);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });
});
