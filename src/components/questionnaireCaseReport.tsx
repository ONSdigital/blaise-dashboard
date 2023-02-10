import React, {Component, ReactElement} from "react";
import {CaseCompletionReport} from "../server/blaiseApi/caseCompletionReport";
import {ONSLoadingPanel} from "blaise-design-system-react-components";

type QuestionnaireCaseReportProps = {
    caseCompletionReport: CaseCompletionReport,
    questionnaireName: string
}

type QuestionnaireCaseReportState = {
    loaded: boolean
}

export default class QuestionnaireCaseReport extends Component<QuestionnaireCaseReportProps, QuestionnaireCaseReportState> {
    constructor(props: QuestionnaireCaseReportProps) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        this.setState({
            loaded: true
        });
    }

    render(): ReactElement {
        if (!this.state.loaded) {
            return <tr><td><ONSLoadingPanel message={"Getting cases"}/></td></tr>;
        }

        // | questionnaire | cases | completed   | progress  |
        // | opn2101a      | 30    | 10 (33.33%) | [##     ] |

        return (
            <tr className="ons-table__row" key={this.props.questionnaireName} data-testid={"questionnaire-table-row"}>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-questionnaire-${this.props.questionnaireName}`}>
                    {this.props.questionnaireName}
                </td>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-total-${this.props.questionnaireName}`}>
                    {this.props.caseCompletionReport.Total}
                </td>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-complete-${this.props.questionnaireName}`}>
                    {this.props.caseCompletionReport.Complete} ({this.props.caseCompletionReport.CompletePercentage}%)
                </td>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-complete-percentage-${this.props.questionnaireName}`}>
                    <progress id="file"
                              value={this.props.caseCompletionReport.CompletePercentage}
                              max="100"
                              role="progressbar"
                              aria-valuenow={this.props.caseCompletionReport.CompletePercentage}
                              aria-valuemin={0}
                              aria-valuemax={100}>
                        {this.props.caseCompletionReport.CompletePercentage}%
                    </progress>
                </td>
            </tr>
        );
    }
}
