import { filterQuestionnaires, getQuestionnaires } from "./questionnaires";
import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "../config";
import { mockQuestionnaireList } from "./testFixtures";
import NodeCache from "node-cache";

jest.mock("blaise-api-node-client");
const config = GetConfigFromEnv();
const cache = new NodeCache({ stdTTL: 60 });

const getQuestionnairesMock = jest.fn();
BlaiseApiClient.prototype.getQuestionnaires = getQuestionnairesMock;
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

describe("Test that TLA filter returns surveys of interest", () => {
    it("should return OPN surveys only when OPN is passed as TLA argument", () => {
        expect(filterQuestionnaires(mockQuestionnaireList, "OPN")).toEqual([
            {
                name: "OPN2101A",
                installDate: "210122",
                serverParkName: "gusty",
                fieldPeriod: "210122"
            },
            {
                name: "OPN2007T",
                installDate: "210122",
                serverParkName: "gusty",
                fieldPeriod: "210122"
            }]
        );
    });
});

describe("getQuestionnaires", () => {
    beforeEach(() => {
        getQuestionnairesMock.mockImplementation(async () => {
            return Promise.resolve(mockQuestionnaireList);
        });
    });

    afterEach(() => {
        cache.flushAll();
        jest.resetAllMocks();
    });

    describe("when an QuestionnaireTLA is provided", () => {
        it("returns a filtered list of Questionnaires", async () => {
            const Questionnaires = await getQuestionnaires(blaiseApiClient, cache, config, "OPN");
            expect(Questionnaires).toHaveLength(2);
        });
    });

    describe("when an QuestionnaireTLA is not provided", () => {
        it("returns an unfiltered list of Questionnaires", async () => {
            const Questionnaires = await getQuestionnaires(blaiseApiClient, cache, config);
            expect(Questionnaires).toHaveLength(3);
        });
    });

    describe("when the cache is not populated", () => {
        it("returns a list of Questionnaires and populate the cache", async () => {
            expect(cache.get("questionnaires")).toBeUndefined();
            const questionnaires = await getQuestionnaires(blaiseApiClient, cache, config);
            expect(questionnaires).toHaveLength(3);
            expect(cache.get("questionnaires")).toHaveLength(3);
        });
    });

    describe("when the cache is populated", () => {
        it("returns the list of questionnaires from the cache without calling blaise", async () => {
            cache.set("questionnaires", mockQuestionnaireList);
            const questionnaires = await getQuestionnaires(blaiseApiClient, cache, config);
            expect(questionnaires).toHaveLength(3);
            expect(cache.get("questionnaires")).toHaveLength(3);
            expect(getQuestionnairesMock).toHaveBeenCalledTimes(0);
        });
    });
});
