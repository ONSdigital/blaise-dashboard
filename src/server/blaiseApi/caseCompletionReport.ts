import {calculateCaseTotals, calculatePercentComplete, CaseCalculations, CaseTotals} from "./calculations.js";
import { CaseStatus } from "blaise-api-node-client";

type CaseStatusLike = Pick<CaseStatus, "primaryKey"> & {
    outcome: CaseStatus["outcome"] | number;
};


export type CaseCompletionReport = CaseTotals & CaseCalculations

export function buildCaseCompletionReport(cases: readonly CaseStatusLike[]): CaseCompletionReport {
    const caseTotals = calculateCaseTotals(cases);
    const caseCompletePercentage = calculatePercentComplete(caseTotals);
    return {
        Total: caseTotals.Total,
        Complete: caseTotals.Complete,
        NotComplete: caseTotals.NotComplete,
        CompletePercentage: caseCompletePercentage
    };
}