import { CaseStatus } from "blaise-api-node-client";
import { isNotCompleted } from "./outcomes.js";

type CaseStatusLike = Pick<CaseStatus, "primaryKey"> & {
  outcome: CaseStatus["outcome"] | number;
};

export type CaseTotals = {
  Total: number;
  Complete: number;
  NotComplete: number;
};

export type CaseCalculations = {
  CompletePercentage: number;
};

export function calculateCaseTotals(
  cases: readonly CaseStatusLike[],
): CaseTotals {
  const caseTotals: CaseTotals = {
    Total: 0,
    Complete: 0,
    NotComplete: 0,
  };

  for (const eachCase of cases) {
    caseTotals.Total++;
    if (isNotCompleted(eachCase.outcome)) {
      caseTotals.NotComplete++;
    } else {
      caseTotals.Complete++;
    }
  }
  return caseTotals;
}

export function calculatePercentComplete(caseTotals: CaseTotals): number {
  if (caseTotals.Total === 0) {
    return 0.0;
  }
  const percentCompleted = (caseTotals.Complete / caseTotals.Total) * 100;
  return round2DP(percentCompleted);
}

function round2DP(numberToRound: number): number {
  return Math.round((numberToRound + Number.EPSILON) * 100) / 100;
}
