import {buildCaseCompletionReport} from "./caseCompletionReport";
import {mockCaseList} from "./testFixtures";

describe("build a case report", () => {
    it("should return a case report with information from all cases in that instrument", () => {

        expect(buildCaseCompletionReport(mockCaseList)).toEqual({
            Total: 7,
            Complete: 3,
            NotComplete: 4,
            CompletePercentage: 42.86
        });
    });
});
