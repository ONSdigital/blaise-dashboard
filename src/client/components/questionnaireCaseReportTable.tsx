import { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { CaseCompletionReport } from "../types/caseCompletionReport";
import { getCaseCompletionReport } from "../api/caseCompletionReport";
import type { Questionnaire } from "blaise-api-node-client";
import {
  LoadingPanel,
  Panel,
  Table,
} from "blaise-design-system-react-components";
import QuestionnaireCaseReport from "./questionnaireCaseReport";

type QuestionnaireCaseReportTableProps = {
  questionnaires: Questionnaire[];
};

type CaseCompletionReportsResult = {
  caseCompletionReports: Record<string, CaseCompletionReport>;
  erroredQuestionnaires: string[];
};

async function getCaseCompletionReports(
  questionnaires: Questionnaire[],
): Promise<CaseCompletionReportsResult> {
  const caseCompletionReports: Record<string, CaseCompletionReport> = {};

  const reportRequests = questionnaires.map(async (questionnaire) => {
    try {
      const report = await getCaseCompletionReport(questionnaire.name);
      return { questionnaireName: questionnaire.name, report };
    } catch {
      return { questionnaireName: questionnaire.name, report: undefined };
    }
  });

  const reportResults = await Promise.all(reportRequests);
  const erroredQuestionnaires: string[] = [];

  reportResults.forEach(({ questionnaireName, report }) => {
    if (report === undefined) {
      erroredQuestionnaires.push(questionnaireName);
      return;
    }

    caseCompletionReports[questionnaireName] = report;
  });

  return {
    caseCompletionReports,
    erroredQuestionnaires,
  };
}

function renderCaseReportRows(
  caseCompletionReports: Record<string, CaseCompletionReport>,
): ReactElement[] {
  const caseReportRows: ReactElement[] = [];

  for (const questionnaireName in caseCompletionReports) {
    caseReportRows.push(
      <QuestionnaireCaseReport
        questionnaireName={questionnaireName}
        caseCompletionReport={caseCompletionReports[questionnaireName]}
        key={questionnaireName}
      />,
    );
  }

  return caseReportRows;
}

function errorPanel(erroredQuestionnaires: string[]): ReactElement | undefined {
  if (erroredQuestionnaires.length === 0) {
    return undefined;
  }

  return (
    <Panel status="error">
      Failed to get completion reports for questionnaires:{" "}
      {erroredQuestionnaires.join(", ")}
    </Panel>
  );
}

export default function QuestionnaireCaseReportTable({
  questionnaires,
}: QuestionnaireCaseReportTableProps): ReactElement {
  const reportsQuery = useQuery<CaseCompletionReportsResult>({
    queryKey: [
      "case-completion-reports",
      questionnaires.map((questionnaire) => questionnaire.name),
    ],
    queryFn: () => getCaseCompletionReports(questionnaires),
    staleTime: 30 * 1000,
  });

  if (reportsQuery.isLoading) {
    return <LoadingPanel message={"Getting case completion reports"} />;
  }

  const reportsData = reportsQuery.data as CaseCompletionReportsResult;
  const caseCompletionReports = reportsData.caseCompletionReports;
  const erroredQuestionnaires = reportsData.erroredQuestionnaires;

  return (
    <>
      {errorPanel(erroredQuestionnaires)}
      <Table
        columns={["Questionnaire", "Cases", "Completed", "Progress"]}
        id="case-report-table"
      >
        <>{renderCaseReportRows(caseCompletionReports)}</>
      </Table>
    </>
  );
}
