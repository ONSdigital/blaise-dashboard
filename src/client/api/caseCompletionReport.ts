import { CaseCompletionReport } from "../types/caseCompletionReport";
import axios from "axios";

export async function getCaseCompletionReport(
  questionnaireName: string,
): Promise<CaseCompletionReport> {
  const response = await axios.get(
    `/api/reports/cases/completions/${questionnaireName}`,
  );

  return response.data;
}
