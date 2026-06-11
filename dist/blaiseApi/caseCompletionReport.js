"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCaseCompletionReport = buildCaseCompletionReport;
const calculations_1 = require("./calculations");
function buildCaseCompletionReport(cases) {
    const caseTotals = (0, calculations_1.calculateCaseTotals)(cases);
    const caseCompletePercentage = (0, calculations_1.calculatePercentComplete)(caseTotals);
    return {
        Total: caseTotals.Total,
        Complete: caseTotals.Complete,
        NotComplete: caseTotals.NotComplete,
        CompletePercentage: caseCompletePercentage
    };
}
//# sourceMappingURL=caseCompletionReport.js.map