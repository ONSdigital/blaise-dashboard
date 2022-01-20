import React, { ReactElement} from "react";
//import { Switch, Route, Link } from "react-router-dom";
import {Footer, Header, BetaBanner, NotProductionWarning} from "blaise-design-system-react-components";
import "./style.css";

const divStyle = {
    minHeight: "calc(67vh)",
};

type AppState = {
    instruments: Instrument[],
    loading: boolean,
    errored: boolean
}

export default class App extends Component<any, any> {
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
        this.getInstrumentList().then((instruments: Instrument[]) => {
            console.log("Got instrument list for mount");
            console.log(instruments);
            this.setState({
                instruments: instruments,
                loading: false,
                errored: false,
            });
        }).catch((reason: any) => {
            console.error(reason);
            this.setState({errored: true});
        });
    }

    async getInstrumentList(): Promise<Instrument[]> {
        if (this.state.loading) {
            return await getInstruments();
        }
        return [];
    }

    errorPanel(): ReactElement | undefined {
        if (this.state.errored) {
            return <ONSPanel status="error">Failed to get questionnaires.</ONSPanel>;
        }
        return undefined;
    }

    loadingPanel(): ReactElement | undefined {
        if (this.state.loading && !this.state.errored) {
            return <ONSLoadingPanel message={"Getting instruments for report"}/>;
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
        return <InstrumentCaseReportTable instruments={this.state.instruments}/>;
    }

    render() {
        return (
            <>
                {
                    (window.location.hostname.includes("dev")) && <NotProductionWarning/>
                }
                <BetaBanner/>
                <Header title={"Dashboard"}/>
                <div style={divStyle} className="page__container container">
                    <main id="main-content" className="page__main u-mt-no">
                        <h2 className="u-mt-m">Completed case information</h2>
                        {this.errorPanel()}
                        {this.loadingPanel()}
                        {this.reportTable()}
                    </main>
                </div>
                <Footer/>
            </>
        );
    }
}
