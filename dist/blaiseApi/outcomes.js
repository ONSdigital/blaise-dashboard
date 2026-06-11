"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleted = isCompleted;
exports.isNotCompleted = isNotCompleted;
const notCompletedOutcomes = [
    0,
    210,
    300,
    310
];
function isCompleted(outcome) {
    return !isNotCompleted(outcome);
}
function isNotCompleted(outcome) {
    return notCompletedOutcomes.includes(outcome);
}
