import { CaseStatus } from "blaise-api-node-client";
export type CaseTotals = {
    Total: number;
    Complete: number;
    NotComplete: number;
};
export type CaseCalculations = {
    CompletePercentage: number;
};
export declare function calculateCaseTotals(cases: readonly CaseStatus[]): CaseTotals;
export declare function calculatePercentComplete(caseTotals: CaseTotals): number;
//# sourceMappingURL=calculations.d.ts.map