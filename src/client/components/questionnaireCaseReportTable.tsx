import React, { Component, ReactElement } from "react";
import { CaseCompletionReport } from "../types/caseCompletionReport";
import { getCaseCompletionReport } from "../api/caseCompletionReport";
import { Questionnaire } from "blaise-api-node-client";
import { LoadingPanel, Panel, Table } from "blaise-design-system-react-components";
import QuestionnaireCaseReport from "./questionnaireCaseReport";
import { refreshInterval } from "../utils/refreshInterval";

type QuestionnaireCaseReportTableProps = {
    questionnaires: Questionnaire[]
}

type QuestionnaireCaseReportTableState = {
    loaded: boolean,
    caseCompletionReports: Record<string, CaseCompletionReport>
    erroredQuestionnaires: string[]
}

export default class QuestionnaireCaseReportTable extends Component<QuestionnaireCaseReportTableProps, QuestionnaireCaseReportTableState> {
    interval!: ReturnType<typeof setInterval>;

    constructor(props: QuestionnaireCaseReportTableProps) {
        super(props);
        this.state = {
            loaded: false,
            caseCompletionReports: {},
            erroredQuestionnaires: []
        };
    }

    componentDidMount() {
        console.log("Getting case completion reports for mount");
        this.loadReports();
        this.interval = setInterval(() => {
            this.loadReports();
        }, refreshInterval);
        console.log("Got case completion reports for mount");
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loadReports(): void {
        this.getCaseCompletionReports().then((caseCompletionReports: Record<string, CaseCompletionReport>) => {
            this.setState({
                loaded: true,
                caseCompletionReports: caseCompletionReports
            });
        });
    }

    async getCaseCompletionReports(): Promise<Record<string, CaseCompletionReport>> {
        const caseCompletionReports: Record<string, CaseCompletionReport> = {};
        for (const questionnaire of this.props.questionnaires) {
            console.log(`Getting completion report for ${questionnaire.name}`);
            try {
                caseCompletionReports[questionnaire.name] = await getCaseCompletionReport(questionnaire.name);
            } catch (reason: unknown) {
                console.error(`Error getting case completion report for ${questionnaire.name}: ${reason}`);
                const erroredQuestionnaires = this.state.erroredQuestionnaires;
                erroredQuestionnaires.push(questionnaire.name);
                this.setState({
                    erroredQuestionnaires: [...new Set(erroredQuestionnaires)]
                });
            }
        }
        return caseCompletionReports;
    }

    errorPanel(): ReactElement | undefined {
        if (this.state.erroredQuestionnaires.length === 0) {
            return undefined;
        }
        return (
            <Panel status="error">
                Failed to get completion reports for questionnaires: {this.state.erroredQuestionnaires.join(", ")}
            </Panel>
        );
    }

    render(): ReactElement {
        if (!this.state.loaded) {
            return <LoadingPanel message={"Getting case completion reports"} />;
        }

        const caseReportRows: ReactElement[] = [];
        for (const questionnaireName in this.state.caseCompletionReports) {
            caseReportRows.push(<QuestionnaireCaseReport
                questionnaireName={questionnaireName}
                caseCompletionReport={this.state.caseCompletionReports[questionnaireName]}
                key={questionnaireName}
            />);
        }

        return (<>
            {this.errorPanel()}
            <Table columns={["Questionnaire", "Cases", "Completed", "Progress"]} id="case-report-table">
                <>{caseReportRows}</>
            </Table>
        </>);
    }
}
