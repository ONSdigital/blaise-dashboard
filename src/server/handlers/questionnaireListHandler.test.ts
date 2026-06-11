import NewServer from "../server.js";
import supertest, { Response } from "supertest";
import { BlaiseApiClient } from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config.js";
import { mockQuestionnaireList } from "../blaiseApi/testFixtures.js";
import NodeCache from "node-cache";

const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });

const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);
const server = NewServer(blaiseApiClient, cache, config);
const request = supertest(server);


import { getQuestionnaires } from "../blaiseApi/questionnaires.js";
vi.mock("../blaiseApi/questionnaires");
const getQuestionnairesMock = vi.mocked(getQuestionnaires);


describe("BlaiseAPI Get all questionnaires from API", () => {
    afterEach(() => {
        getQuestionnairesMock.mockClear();
        cache.flushAll();
    });

    it("should return a 200 status and a json list of 3 items when API returns a 3 item list", async () => {
        getQuestionnairesMock.mockResolvedValue(mockQuestionnaireList);

        const response: Response = await request.get("/api/questionnaires");

        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual(mockQuestionnaireList);
        expect(response.body.length).toStrictEqual(3);
        expect(getQuestionnairesMock).toHaveBeenCalledWith(
            expect.any(Object),
            expect.any(Object),
            expect.any(Object)
        );
    });

    it("should return a 500 status direct from the API", async () => {
        getQuestionnairesMock.mockRejectedValue(null);

        const response: Response = await request.get("/api/questionnaires");

        expect(response.status).toEqual(500);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });
});
