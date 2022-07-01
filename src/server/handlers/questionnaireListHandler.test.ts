import NewServer from "../server";
import supertest, { Response } from "supertest";
import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config";
import NodeCache from "node-cache";

const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });

const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

const { QuestionnaireListMockObject } = jest.requireActual("blaise-api-node-client");
const server = NewServer(blaiseApiClient, cache, config);
const request = supertest(server);


import { getQuestionnaires } from "../blaiseApi/questionnaires";
jest.mock("../blaiseApi/questionnaires");
const getQuestionnairesMock = getQuestionnaires as jest.MockedFunction<typeof getQuestionnaires>;


describe("BlaiseAPI Get all questionnaires from API", () => {
    afterEach(() => {
        getQuestionnairesMock.mockClear();
        cache.flushAll();
    });

    it("should return a 200 status and a json list of 3 items when API returns a 3 item list", async () => {
        getQuestionnairesMock.mockReturnValue(QuestionnaireListMockObject);

        const response: Response = await request.get("/api/questionnaires");

        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual(QuestionnaireListMockObject);
        expect(response.body.length).toStrictEqual(3);
    });

    it("should return a 500 status direct from the API", async () => {
        getQuestionnairesMock.mockRejectedValue(null);

        const response: Response = await request.get("/api/questionnaires");

        expect(response.status).toEqual(500);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });
});
