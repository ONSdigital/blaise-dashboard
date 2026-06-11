import { CaseCalculations, CaseTotals } from "./calculations";
import { CaseStatus } from "blaise-api-node-client";
export type CaseCompletionReport = CaseTotals & CaseCalculations;
export declare function buildCaseCompletionReport(cases: readonly CaseStatus[]): CaseCompletionReport;
//# sourceMappingURL=caseCompletionReport.d.ts.map