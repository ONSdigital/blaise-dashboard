import React, { Component, ReactElement } from "react";
import { CaseCompletionReport } from "../server/blaiseApi/caseCompletionReport";
import { getCaseCompletionReport } from "../client/caseCompletionReport";
import { Instrument } from "blaise-api-node-client";
import { ONSLoadingPanel, ONSPanel, ONSTable } from "blaise-design-system-react-components";
import InstrumentCaseReport from "./instrumentCaseReport";
import { refreshInterval } from "../client/refreshInterval";

type InstrumentCaseReportTableProps = {
    instruments: Instrument[]
}

type InstrumentCaseReportTableState = {
    loaded: boolean,
    caseCompletionReports: Record<string, CaseCompletionReport>
    erroredInstruments: string[]
}

export default class InstrumentCaseReportTable extends Component<InstrumentCaseReportTableProps, InstrumentCaseReportTableState> {
    interval!: ReturnType<typeof setInterval>;

    constructor(props: InstrumentCaseReportTableProps) {
        super(props);
        this.state = {
            loaded: false,
            caseCompletionReports: {},
            erroredInstruments: []
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
        for (const instrument of this.props.instruments) {
            console.log(`Getting completion report for ${instrument.name}`);
            try {
                caseCompletionReports[instrument.name] = await getCaseCompletionReport(instrument.name);
            } catch (reason: unknown) {
                console.error(`Error getting case completion report for ${instrument.name}: ${reason}`);
                const erroredInstruments = this.state.erroredInstruments;
                erroredInstruments.push(instrument.name);
                this.setState({
                    erroredInstruments: [...new Set(erroredInstruments)]
                });
            }
        }
        return caseCompletionReports;
    }

    errorPanel(): ReactElement | undefined {
        if (this.state.erroredInstruments.length === 0) {
            return undefined;
        }
        return (
            <ONSPanel status="error">
                Failed to get completion reports for instruments: {this.state.erroredInstruments.join(", ")}
            </ONSPanel>
        );
    }

    render(): ReactElement {
        if (!this.state.loaded) {
            return <ONSLoadingPanel message={"Getting case completion reports"} />;
        }

        const caseReportRows: ReactElement[] = [];
        for (const instrumentName in this.state.caseCompletionReports) {
            caseReportRows.push(<InstrumentCaseReport
                instrumentName={instrumentName}
                caseCompletionReport={this.state.caseCompletionReports[instrumentName]}
                key={instrumentName}
            />);
        }

        return (<>
            {this.errorPanel()}
            <ONSTable columns={["Questionnaire", "Cases", "Completed", "Progress"]} tableID="case-report-table">
                <>{caseReportRows}</>
            </ONSTable>
        </>);
    }
}
