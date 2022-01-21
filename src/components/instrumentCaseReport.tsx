import React, {Component, ReactElement} from "react";
import {CaseCompletionReport} from "../server/blaiseApi/caseCompletionReport";
import {ONSLoadingPanel} from "blaise-design-system-react-components";

type InstrumentCaseReportProps = {
    caseCompletionReport: CaseCompletionReport,
    instrumentName: string
}

type InstrumentCaseReportState = {
    loaded: boolean
}

export default class InstrumentCaseReport extends Component<InstrumentCaseReportProps, InstrumentCaseReportState> {
    constructor(props: InstrumentCaseReportProps) {
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
            <tr className="table__row" key={this.props.instrumentName} data-testid={"instrument-table-row"}>
                <td className="table__cell" data-testid={`instrument-case-report-questionnaire-${this.props.instrumentName}`}>
                    {this.props.instrumentName}
                </td>
                <td className="table__cell" data-testid={`instrument-case-report-total-${this.props.instrumentName}`}>
                    {this.props.caseCompletionReport.Total}
                </td>
                <td className="table__cell" data-testid={`instrument-case-report-complete-${this.props.instrumentName}`}>
                    {this.props.caseCompletionReport.Complete} ({this.props.caseCompletionReport.CompletePercentage}%)
                </td>
                <td className="table__cell" data-testid={`instrument-case-report-complete-percentage-${this.props.instrumentName}`}>
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
