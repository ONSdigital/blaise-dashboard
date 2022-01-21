import React, { ReactElement, useState, useEffect, Component } from "react";
import { Instrument } from "blaise-api-node-client";
//import { Switch, Route, Link } from "react-router-dom";
import {
    Footer,
    Header,
    BetaBanner,
    NotProductionWarning,
    ONSLoadingPanel,
    ONSPanel
} from "blaise-design-system-react-components";
import "./style.css";
import { getInstruments } from "./client/instruments";
import InstrumentCaseReportTable from "./components/instrumentCaseReportTable";
import { refreshInterval } from "./client/refreshInterval";

const divStyle = {
    minHeight: "calc(67vh)",
};

type AppState = {
    instruments: Instrument[],
    loading: boolean,
    errored: boolean
}

export default class App extends Component<any, any> {
    interval!: ReturnType<typeof setInterval>;

    constructor(props: any) {
        super(props);
        this.state = {
            instruments: [],
            loading: true,
            errored: false
        };
    }

    componentDidMount() {
        console.log("Getting instrument list for mount");
        this.loadInstruments();
        this.interval = setInterval(() => {
            this.loadInstruments();
        }, refreshInterval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loadInstruments(): void {
        console.log("Getting instruments list");
        this.getInstrumentList().then((instruments: Instrument[]) => {
            this.setState({
                instruments: instruments,
                loading: false,
                errored: false,
            });
        }).catch((reason: unknown) => {
            console.error(reason);
            this.setState({ errored: true });
        });
    }

    async getInstrumentList(): Promise<Instrument[]> {
        return await getInstruments();
    }

    errorPanel(): ReactElement | undefined {
        if (this.state.errored) {
            return <ONSPanel status="error">Failed to get questionnaires.</ONSPanel>;
        }
        return undefined;
    }

    loadingPanel(): ReactElement | undefined {
        if (this.state.loading && !this.state.errored) {
            return <ONSLoadingPanel message={"Getting instruments for report"} />;
        }
        return undefined;
    }

    reportTable(): ReactElement | undefined {
        if (this.state.loading) {
            return undefined;
        }
        if (this.state.instruments.length === 0) {
            return <ONSPanel>No questionnaires installed.</ONSPanel>;
        }
        return <InstrumentCaseReportTable instruments={this.state.instruments} />;
    }

    render() {
        return (
            <>
                {
                    (window.location.hostname.includes("dev")) && <NotProductionWarning />
                }
                <BetaBanner />
                <Header title={"Dashboard"} />
                <div style={divStyle} className="page__container container">
                    <main id="main-content" className="page__main u-mt-no">
                        <h2 className="u-mt-m">Completed case information</h2>
                        {this.errorPanel()}
                        {this.loadingPanel()}
                        {this.reportTable()}
                    </main>
                </div>
                <Footer />
            </>
        );
    }
}
