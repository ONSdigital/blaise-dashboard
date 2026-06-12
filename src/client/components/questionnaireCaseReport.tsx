import { ReactElement } from "react";
import { CaseCompletionReport } from "../types/caseCompletionReport";

type QuestionnaireCaseReportProps = {
  caseCompletionReport: CaseCompletionReport;
  questionnaireName: string;
};

export default function QuestionnaireCaseReport({
  caseCompletionReport,
  questionnaireName,
}: QuestionnaireCaseReportProps): ReactElement {
  return (
    <tr
      className="ons-table__row"
      key={questionnaireName}
      data-testid={"questionnaire-table-row"}
    >
      <td
        className="ons-table__cell"
        data-testid={`questionnaire-case-report-questionnaire-${questionnaireName}`}
      >
        {questionnaireName}
      </td>
      <td
        className="ons-table__cell"
        data-testid={`questionnaire-case-report-total-${questionnaireName}`}
      >
        {caseCompletionReport.Total}
      </td>
      <td
        className="ons-table__cell"
        data-testid={`questionnaire-case-report-complete-${questionnaireName}`}
      >
        {caseCompletionReport.Complete} (
        {caseCompletionReport.CompletePercentage}
        %)
      </td>
      <td
        className="ons-table__cell"
        data-testid={`questionnaire-case-report-complete-percentage-${questionnaireName}`}
      >
        <progress
          id="file"
          value={caseCompletionReport.CompletePercentage}
          max="100"
          role="progressbar"
          aria-valuenow={caseCompletionReport.CompletePercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {caseCompletionReport.CompletePercentage}%
        </progress>
      </td>
    </tr>
  );
}
