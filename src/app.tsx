import React, {Component, ReactElement} from "react";
import {Questionnaire} from "blaise-api-node-client";
import {
    BetaBanner,
    Collapsible,
    Footer,
    Header,
    ONSLoadingPanel,
    ONSPanel
} from "blaise-design-system-react-components";
import "./style.css";
import {getQuestionnaires} from "./client/questionnaires";
import QuestionnaireCaseReportTable from "./components/questionnaireCaseReportTable";
import {refreshInterval} from "./client/refreshInterval";
import { getMonitoring } from "./client/monitoring";
import { MonitoringDataModel } from "./server/monitoringDataModel";
import MonitoringUptimeChecksTable from "./components/monitoringUptimeChecksTable";

const divStyle = {
    minHeight: "calc(67vh)",
};

type AppState = {
    questionnaires: Questionnaire[],
    loading: boolean,
    errored: boolean,
    uptimeChecks: MonitoringDataModel[],
    uptimeChecksLoading : boolean
}

export default class App extends Component<unknown, AppState> {
    interval!: ReturnType<typeof setInterval>;

    constructor(props: unknown) {
        super(props);
        this.state = {
            questionnaires: [],
            loading: true,
            errored: false,
            uptimeChecksLoading : true,
            uptimeChecks : []
        };
    }

    componentDidMount() {
        console.log("Getting questionnaires list for mount");
        this.loadQuestionnaires();
        this.loadMonitoringData();
        this.interval = setInterval(() => {
            this.loadQuestionnaires();
            this.loadMonitoringData();
        }, refreshInterval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loadMonitoringData(): void {
        console.log("Getting Monitoring Data");
        this.getMonitoringDataList().then((uptimeChecks: MonitoringDataModel[]) => {
            console.log(uptimeChecks);
            this.setState({
                uptimeChecks: uptimeChecks,
                uptimeChecksLoading : false
            });
        }).catch((reason: unknown) => {
            console.error(reason);
        });
    }

    loadQuestionnaires(): void {
        console.log("Getting questionnaires list");
        this.getQuestionnaireList().then((questionnaires: Questionnaire[]) => {
            this.setState({
                questionnaires: questionnaires,
                loading: false,
                errored: false,
            });
        }).catch((reason: unknown) => {
            console.error(reason);
            this.setState({errored: true});
        });
    }

    async getQuestionnaireList(): Promise<Questionnaire[]> {
        return await getQuestionnaires();
    }

    async getMonitoringDataList(): Promise<MonitoringDataModel[]> {
        return await getMonitoring();
    }

    errorPanel(): ReactElement | undefined {
        if (this.state.errored) {
            return <ONSPanel status="error">Failed to get questionnaires.</ONSPanel>;
        }
        return undefined;
    }

    loadingPanel(): ReactElement | undefined {
        if (this.state.loading && !this.state.errored) {
            return <ONSLoadingPanel message={"Getting questionnaires for report"}/>;
        }
        return undefined;
    }

    UptimeChecksloadingPanel(): ReactElement | undefined {
        if (this.state.uptimeChecksLoading) {
            return <ONSLoadingPanel message={"Getting uptime checks for services"}/>;
        }
        return undefined;
    }

    reportTable(): ReactElement | undefined {
        if (this.state.loading) {
            return undefined;
        }
        if (this.state.questionnaires.length === 0) {
            return <ONSPanel>No questionnaires installed.</ONSPanel>;
        }
        return <QuestionnaireCaseReportTable questionnaires={this.state.questionnaires}/>;
    }

    completedCaseDefinition(): ReactElement | undefined {
        if (this.state.loading !== true && this.state.questionnaires.length !== 0) {
            return <Collapsible title="What is a completed case?">
                <>
                    <p>Completed cases are cases that do <strong>NOT</strong> have any of the following outcome codes:</p>
                    <ul className="ons-list">
                        <li className="ons-list__item">
                            0 - Not actioned
                        </li>
                        <li className="ons-list__item">
                            210 - Partial
                        </li>
                        <li className="ons-list__item">
                            300 - Appointment made
                        </li>
                        <li className="ons-list__item">
                            310 - Non-contact
                        </li>
                    </ul>
                </>
            </Collapsible>;
        }
    }

    ServiceHealthCheck(): ReactElement | undefined {
        if (this.state.uptimeChecksLoading) {
            return undefined;
        }
        if (this.state.uptimeChecks.length === 0 || this.state.uptimeChecksLoading) {
            return <ONSPanel>No Uptime checks data.</ONSPanel>;
        }
        return <MonitoringUptimeChecksTable monitoringData={this.state.uptimeChecks}/>;
    }

    render() {
        return (
            <>
                <BetaBanner/>
                <Header title={"Dashboard"}/>
                <div style={divStyle} className="ons-page__container ons-container">
                    <main id="main-content" className="ons-page__main ons-u-mt-no">
                        <h2 className="ons-u-mt-m">Completed case information</h2>
                        {this.errorPanel()}
                        {this.loadingPanel()}
                        {this.reportTable()}
                        {this.completedCaseDefinition()}
                        <h2 className="ons-u-mt-m">Service Health Check Information</h2>
                        {this.UptimeChecksloadingPanel()}
                        {this.ServiceHealthCheck()}
                    </main>
                </div>
                <Footer/>
            </>
        );
    }
}
