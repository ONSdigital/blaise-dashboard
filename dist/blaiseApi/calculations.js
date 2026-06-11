"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCaseTotals = calculateCaseTotals;
exports.calculatePercentComplete = calculatePercentComplete;
const outcomes_1 = require("./outcomes");
function calculateCaseTotals(cases) {
    const caseTotals = {
        Total: 0,
        Complete: 0,
        NotComplete: 0,
    };
    for (const eachCase of cases) {
        caseTotals.Total++;
        if ((0, outcomes_1.isNotCompleted)(eachCase.outcome)) {
            caseTotals.NotComplete++;
        }
        else {
            caseTotals.Complete++;
        }
    }
    return caseTotals;
}
function calculatePercentComplete(caseTotals) {
    if (caseTotals.Total === 0) {
        return 0.00;
    }
    const percentCompleted = caseTotals.Complete / caseTotals.Total * 100;
    return round2DP(percentCompleted);
}
function round2DP(numberToRound) {
    return Math.round((numberToRound + Number.EPSILON) * 100) / 100;
}
