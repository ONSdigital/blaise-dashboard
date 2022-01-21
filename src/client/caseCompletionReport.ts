import { CaseCompletionReport } from "../server/blaiseApi/caseCompletionReport";
import axios from "axios";

export async function getCaseCompletionReport(instrumentName: string): Promise<CaseCompletionReport> {
  const response = await axios.get(`/api/reports/cases/completions/${instrumentName}`);

  return response.data;
}
