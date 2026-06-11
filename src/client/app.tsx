import React, {Component, ReactElement} from "react";
import type { Questionnaire } from "blaise-api-node-client";
import {
    Collapsible,
    Footer,
    Header,
    LoadingPanel,
    Panel
} from "blaise-design-system-react-components";
import {getQuestionnaires} from "./api/questionnaires";
import QuestionnaireCaseReportTable from "./components/questionnaireCaseReportTable";
import { getMonitoring } from "./api/monitoring";
import { MonitoringDataModel } from "./types/monitoringDataModel";
import MonitoringUptimeChecksTable from "./components/monitoringUptimeChecksTable";
import BlaiseStatusPanel from "./components/blaiseStatus";
import QuestionnaireInstallStatusPanel from "./components/questionnaireInstallStatus";
import ErrorLogsTable from "./components/errorLogsTable";
import CawiLoginSuccessChart from "./components/cawiLoginSuccessChart";

const divStyle = {
    minHeight: "calc(67vh)",
};

type AppState = {
    questionnaires: Questionnaire[],
    questionnaireLoading: boolean,
    questionnaireErrored: boolean,
    uptimeChecks: MonitoringDataModel[],
    uptimeChecksLoading: boolean,
    uptimeChecksErrored: boolean,
    uptimeChecksErrorMessage: string
}

export default class App extends Component<unknown, AppState> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            questionnaires: [],
            questionnaireLoading: true,
            questionnaireErrored: false,
            uptimeChecksLoading: true,
            uptimeChecks: [],
            uptimeChecksErrored: false,
            uptimeChecksErrorMessage: ""
        };
    }

    componentDidMount() {
        console.log("Getting questionnaires list for mount");
        this.loadQuestionnaires();
        this.loadMonitoringData();
    }

    loadMonitoringData(): void {
        console.log("Getting monitoring data");
        this.getMonitoringDataList().then((uptimeChecks: MonitoringDataModel[]) => {
            console.log(uptimeChecks);
            this.setState({
                uptimeChecks: uptimeChecks,
                uptimeChecksLoading: false,
                uptimeChecksErrored: false,
                uptimeChecksErrorMessage: ""
            });
        }).catch((reason: unknown) => {
            console.error(reason);
            this.setState({
                uptimeChecks: [],
                uptimeChecksLoading: false,
                uptimeChecksErrored: true,
                uptimeChecksErrorMessage: this.extractMonitoringErrorMessage(reason)
            });
        });
    }

    extractMonitoringErrorMessage(reason: unknown): string {
        if (typeof reason === "object" && reason !== null && "response" in reason) {
            const response = (reason as { response?: { data?: unknown } }).response;
            if (typeof response?.data === "string" && response.data.trim().length > 0) {
                return response.data;
            }
        }

        return "Failed to get uptime checks.";
    }

    loadQuestionnaires(): void {
        console.log("Getting questionnaires list");
        this.getQuestionnaireList().then((questionnaires: Questionnaire[]) => {
            const filteredQuestionnaires = questionnaires.filter(
                (questionnaire) => !/^IPS/i.test(questionnaire.name)
            );
            this.setState({
                questionnaires: filteredQuestionnaires,
                questionnaireLoading: false,
                questionnaireErrored: false,
            });
        }).catch((reason: unknown) => {
            console.error(reason);
            this.setState({questionnaireErrored: true});
        });
    }

    async getQuestionnaireList(): Promise<Questionnaire[]> {
        return await getQuestionnaires();
    }

    async getMonitoringDataList(): Promise<MonitoringDataModel[]> {
        return await getMonitoring();
    }

    questionnaireErrorPanel(): ReactElement | undefined {
        if (this.state.questionnaireErrored) {
            return <Panel status="error">Failed to get questionnaires.</Panel>;
        }
        return undefined;
    }

    uptimeChecksErrorPanel(): ReactElement | undefined {
        if (this.state.uptimeChecksErrored) {
            return <Panel status="error">{this.state.uptimeChecksErrorMessage}</Panel>;
        }
        return undefined;
    }

    questionnaireLoadingPanel(): ReactElement | undefined {
        if (this.state.questionnaireLoading && !this.state.questionnaireErrored) {
            return <LoadingPanel message={"Getting questionnaires for report"}/>;
        }
        return undefined;
    }

    uptimeChecksloadingPanel(): ReactElement | undefined {
        if (this.state.uptimeChecksLoading) {
            return <LoadingPanel message={"Getting uptime checks for services"}/>;
        }
        return undefined;
    }

    questionnaireReportTable(): ReactElement | undefined {
        if (this.state.questionnaireLoading) {
            return undefined;
        }
        if (this.state.questionnaires.length === 0) {
            return <Panel>No questionnaires installed.</Panel>;
        }
        return <QuestionnaireCaseReportTable questionnaires={this.state.questionnaires}/>;
    }

    completedCaseDefinition(): ReactElement | undefined {
        if (this.state.questionnaireLoading !== true && this.state.questionnaires.length !== 0) {
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
        if (this.state.uptimeChecksLoading || this.state.uptimeChecksErrored) {
            return undefined;
        }
        if (this.state.uptimeChecks.length === 0) {
            return <Panel>No uptime checks data.</Panel>;
        }
        return <MonitoringUptimeChecksTable monitoringData={this.state.uptimeChecks}/>;
    }

    render() {
        return (
            <>
                <Header title={"Dashboard"}/>
                <div style={divStyle} className="ons-page__container ons-container">
                    <main id="main-content" className="ons-page__main ons-u-mt-no">
                        <h2 className="ons-u-mt-m">Service uptime status</h2>
                        {this.uptimeChecksloadingPanel()}
                        {this.uptimeChecksErrorPanel()}
                        {this.ServiceHealthCheck()}
                        <h2 className="ons-u-mt-m">Blase health check status</h2>
                        <BlaiseStatusPanel />
                        <h2 className="ons-u-mt-m">Questionnaire install status</h2>
                        <QuestionnaireInstallStatusPanel />
                        <h2 className="ons-u-mt-m">Case completion status</h2>
                        {this.questionnaireErrorPanel()}
                        {this.questionnaireLoadingPanel()}
                        {this.questionnaireReportTable()}
                        {this.completedCaseDefinition()}
                        <h2 className="ons-u-mt-m">Successful CAWI logins (last 24 hours)</h2>
                        <CawiLoginSuccessChart />
                        <h2 className="ons-u-mt-m">BTS logs (last 24 hours)</h2>
                        <ErrorLogsTable scope="bts" />
                        <h2 className="ons-u-mt-m">NISRA logs (last 24 hours)</h2>
                        <ErrorLogsTable scope="nisra" />
                        <h2 className="ons-u-mt-m">REST API logs (last 24 hours)</h2>
                        <ErrorLogsTable scope="restapi" />
                        <h2 className="ons-u-mt-m">Blaise error logs (last 24 hours)</h2>
                        <ErrorLogsTable scope="blaise" />
                        <h2 className="ons-u-mt-m">Non-Blaise error logs (last 24 hours)</h2>
                        <ErrorLogsTable scope="non-blaise" />
                    </main>
                </div>
                <Footer/>
            </>
        );
    }
}
