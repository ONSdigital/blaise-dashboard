import { Component, ReactElement } from "react";
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

type QuestionnaireCaseReportTableState = {
  loaded: boolean;
  caseCompletionReports: Record<string, CaseCompletionReport>;
  erroredQuestionnaires: string[];
};

type CaseCompletionReportsResult = {
  caseCompletionReports: Record<string, CaseCompletionReport>;
  erroredQuestionnaires: string[];
};

export default class QuestionnaireCaseReportTable extends Component<
  QuestionnaireCaseReportTableProps,
  QuestionnaireCaseReportTableState
> {
  constructor(props: QuestionnaireCaseReportTableProps) {
    super(props);
    this.state = {
      loaded: false,
      caseCompletionReports: {},
      erroredQuestionnaires: [],
    };
  }

  componentDidMount() {
    void this.loadReports();
  }

  async loadReports(): Promise<void> {
    const { caseCompletionReports, erroredQuestionnaires } =
      await this.getCaseCompletionReports();

    this.setState({
      loaded: true,
      caseCompletionReports,
      erroredQuestionnaires,
    });
  }

  async getCaseCompletionReports(): Promise<CaseCompletionReportsResult> {
    const caseCompletionReports: Record<string, CaseCompletionReport> = {};

    const reportRequests = this.props.questionnaires.map(
      async (questionnaire) => {
        try {
          const report = await getCaseCompletionReport(questionnaire.name);
          return { questionnaireName: questionnaire.name, report };
        } catch {
          return { questionnaireName: questionnaire.name, report: undefined };
        }
      },
    );

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

  renderCaseReportRows(): ReactElement[] {
    const caseReportRows: ReactElement[] = [];
    for (const questionnaireName in this.state.caseCompletionReports) {
      caseReportRows.push(
        <QuestionnaireCaseReport
          questionnaireName={questionnaireName}
          caseCompletionReport={
            this.state.caseCompletionReports[questionnaireName]
          }
          key={questionnaireName}
        />,
      );
    }
    return caseReportRows;
  }

  errorPanel(): ReactElement | undefined {
    if (this.state.erroredQuestionnaires.length === 0) {
      return undefined;
    }
    return (
      <Panel status="error">
        Failed to get completion reports for questionnaires:{" "}
        {this.state.erroredQuestionnaires.join(", ")}
      </Panel>
    );
  }

  render(): ReactElement {
    if (!this.state.loaded) {
      return <LoadingPanel message={"Getting case completion reports"} />;
    }

    return (
      <>
        {this.errorPanel()}
        <Table
          columns={["Questionnaire", "Cases", "Completed", "Progress"]}
          id="case-report-table"
        >
          <>{this.renderCaseReportRows()}</>
        </Table>
      </>
    );
  }
}
