import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {getCaseCompletionReport} from "./caseCompletionReport";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios, {onNoMatch: "throwException"});

describe("getCaseCompletionReport tests", () => {
    beforeAll(() => {
        jest.clearAllMocks();
        mock.reset();
    });

    it("It should return a caseCompletionReport", async () => {
        mock.onGet("/api/reports/cases/completions/dst2101a").reply(200, {
                Total: 1,
                Complete: 1,
                NotComplete: 0,
                CompletePercentage: 100
            });

        const result = await getCaseCompletionReport("dst2101a");
        expect(result).toStrictEqual({
                Total: 1,
                Complete: 1,
                NotComplete: 0,
                CompletePercentage: 100
            });
    });
});
