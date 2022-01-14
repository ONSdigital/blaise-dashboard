import NewServer from "../server";
import supertest, {Response} from "supertest";
import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config";

const config = GetConfigFromEnv();
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

jest.mock("blaise-api-node-client");
const getInstrumentsMock = jest.fn();
blaiseApiClient.getInstruments = getInstrumentsMock;

const {InstrumentListMockObject} = jest.requireActual("blaise-api-node-client");
const server = NewServer(blaiseApiClient, config);
const request = supertest(server);

describe("BlaiseAPI Get all instruments from API", () => {
    it("should return a 200 status and an empty string when the API returns an empty list", async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getInstrumentsMock.mockImplementation(() => {
            return Promise.resolve([]);
        });

        await request
            .get("/api/instruments")
            .expect(200, []);
    });

    it("should return a 200 status and a json list of 3 items when API returns a 3 item list", async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getInstrumentsMock.mockImplementation(() => {
            return Promise.resolve(InstrumentListMockObject);
        });

        const response: Response = await request.get("/api/instruments");

        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual(InstrumentListMockObject);
        expect(response.body.length).toStrictEqual(3);
    });

    it("should return a 500 status direct from the API", async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getInstrumentsMock.mockImplementation(() => {
             return Promise.reject();
        });

        const response: Response = await request.get("/api/instruments");

        expect(response.status).toEqual(500);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });
});