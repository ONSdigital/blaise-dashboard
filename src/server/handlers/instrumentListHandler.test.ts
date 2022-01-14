import supertest, {Response} from "supertest";
import BlaiseApiRestClient, {InstrumentListMockObject} from "blaise-api-node-client";
import NewServer from "../server";

jest.mock("blaise-api-node-client");

// const {InstrumentListMockObject} = jest.requireActual("blaise-api-node-client");
const server = NewServer();
const request = supertest(server);


describe("BlaiseAPI Get all instruments from API", () => {
    it("should return a 200 status and an empty string when the API returns an empty list", async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        BlaiseApiRestClient.mockImplementation(() => {
            return {
                getInstruments: () => {
                    return Promise.resolve(["foo"]);
                },
            };
        });

        await request
            .get("/api/instruments")
            .expect(200, '');
    });

    it("should return a 200 status and a json list of 3 items when API returns a 3 item list", async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        BlaiseApiRestClient.mockImplementation(() => {
            return {
                getInstruments: () => {
                    return Promise.resolve(InstrumentListMockObject);
                },
            };
        });

        const response: Response = await request.get("/api/instruments");

        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual(InstrumentListMockObject);
        expect(response.body.length).toStrictEqual(3);
    });

    it("should return a 500 status direct from the API", async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        BlaiseApiRestClient.mockImplementation(() => {
            return {
                getInstruments: () => {
                    return Promise.reject();
                },
            };
        });

        const response: Response = await request.get("/api/instruments");

        expect(response.status).toEqual(500);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });
});