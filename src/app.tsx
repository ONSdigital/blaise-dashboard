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

const divStyle = {
    minHeight: "calc(67vh)",
};

type AppState = {
    questionnaires: Questionnaire[],
    loading: boolean,
    errored: boolean
}

export default class App extends Component<unknown, AppState> {
    interval!: ReturnType<typeof setInterval>;

    constructor(props: unknown) {
        super(props);
        this.state = {
            questionnaires: [],
            loading: true,
            errored: false
        };
    }

    componentDidMount() {
        console.log("Getting questionnaires list for mount");
        this.loadQuestionnaires();
        this.interval = setInterval(() => {
            this.loadQuestionnaires();
        }, refreshInterval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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

    render() {
        return (
            <>
                <BetaBanner/>
                <Header title={"Dashboard"}/>
                <div style={divStyle} className="page__container container">
                    <main id="main-content" className="page__main u-mt-no">
                        <h2 className="u-mt-m">Completed case information</h2>
                        {this.errorPanel()}
                        {this.loadingPanel()}
                        {this.reportTable()}
                        {this.completedCaseDefinition()}
                    </main>
                </div>
                <Footer/>
            </>
        );
    }
}
