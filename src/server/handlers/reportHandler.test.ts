import NewServer from "../server";
import supertest, { Response } from "supertest";
import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config";
import { mockCaseList } from "../blaiseApi/testFixtures";
import NodeCache from "node-cache";


jest.mock("blaise-api-node-client");
const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });

const mockGetCaseStatus = jest.fn();
BlaiseApiClient.prototype.getCaseStatus = mockGetCaseStatus;
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

const server = NewServer(blaiseApiClient, cache, config);
const request = supertest(server);


describe("Build a case report", () => {
    beforeEach(() => {
        mockGetCaseStatus.mockClear();
        cache.flushAll();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should return a 200 status and a case report", async () => {
        mockGetCaseStatus.mockImplementation(async () => {
            return Promise.resolve(mockCaseList);
        });

        const response: Response = await request.get("/api/reports/cases/completions/dst2101a");

        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual({
            Total: 7,
            Complete: 3,
            NotComplete: 4,
            CompletePercentage: 42.86
        });
    });

    it("should return a 500 status direct from the API", async () => {
        mockGetCaseStatus.mockImplementation(async () => {
            return Promise.reject();
        });
        const response: Response = await request.get("/api/reports/cases/completions/dst2101a");

        expect(response.status).toEqual(500);
    });

    describe("when the cache is not populated", () => {
        it("returns a list of questionnaires and populate the cache", async () => {
            mockGetCaseStatus.mockImplementation(async () => {
                return Promise.resolve(mockCaseList);
            });


            expect(cache.get("caseStatus:dst2101a")).toBeUndefined();

            await request.get("/api/reports/cases/completions/dst2101a");

            expect(cache.get("caseStatus:dst2101a")).toEqual({
                Total: 7,
                Complete: 3,
                NotComplete: 4,
                CompletePercentage: 42.86
            });
        });
    });

    describe("when the cache is populated", () => {
        it("returns the list of questionnaires from the cache without calling blaise", async () => {
            mockGetCaseStatus.mockImplementation(async () => {
                return Promise.resolve(mockCaseList);
            });

            cache.set("caseStatus:dst2101a", {
                Total: 7,
                Complete: 3,
                NotComplete: 4,
                CompletePercentage: 42.86
            });

            const response = await request.get("/api/reports/cases/completions/dst2101a");

            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual({
                Total: 7,
                Complete: 3,
                NotComplete: 4,
                CompletePercentage: 42.86
            });
            expect(cache.get("caseStatus:dst2101a")).toEqual({
                Total: 7,
                Complete: 3,
                NotComplete: 4,
                CompletePercentage: 42.86
            });
            expect(mockGetCaseStatus).toHaveBeenCalledTimes(0);
        });
    });
});
