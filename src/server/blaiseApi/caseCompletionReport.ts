import {calculateCaseTotals, calculatePercentComplete, CaseCalculations, CaseTotals} from "./calculations";
import {CaseStatus} from "blaise-api-node-client";


export type CaseCompletionReport = CaseTotals & CaseCalculations

export function buildCaseCompletionReport(cases: CaseStatus[]): CaseCompletionReport {
    const caseTotals = calculateCaseTotals(cases);
    const caseCompletePercentage = calculatePercentComplete(caseTotals)
    return {
        Total: caseTotals.Total,
        Complete: caseTotals.Complete,
        NotComplete: caseTotals.NotComplete,
        CompletePercentage: caseCompletePercentage
    }
}