import { Component, ReactElement } from "react";
import {
  LoadingPanel,
  Panel,
  Table,
} from "blaise-design-system-react-components";
import {
  getQuestionnaireInstallStatus,
  QuestionnaireInstallStatus,
} from "../api/questionnaireInstallStatus";

type QuestionnaireInstallStatusState = {
  loading: boolean;
  installStatuses: QuestionnaireInstallStatus[];
  errored: boolean;
};

export default class QuestionnaireInstallStatusPanel extends Component<
  Record<string, never>,
  QuestionnaireInstallStatusState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      loading: true,
      installStatuses: [],
      errored: false,
    };

    this.loadInstallStatuses = this.loadInstallStatuses.bind(this);
  }

  componentDidMount(): void {
    void this.loadInstallStatuses();
  }

  async loadInstallStatuses(): Promise<void> {
    try {
      const installStatuses = await getQuestionnaireInstallStatus();
      this.setState({ loading: false, installStatuses, errored: false });
    } catch {
      this.setState({ loading: false, installStatuses: [], errored: true });
    }
  }

  renderRows(): ReactElement[] {
    return this.state.installStatuses.map((status) => {
      const statusText = status.activeOnAllNodes
        ? "Active"
        : "Not active on all nodes";
      const statusClass = status.activeOnAllNodes ? "success" : "error";

      return (
        <tr
          className="ons-table__row"
          key={status.questionnaireName}
          data-testid="questionnaire-install-status-row"
        >
          <td className="ons-table__cell">{status.questionnaireName}</td>
          <td className="ons-table__cell">{`${status.activeNodes}/${status.totalNodes}`}</td>
          <td className="ons-table__cell">
            <span
              className={`ons-status ons-status--${statusClass}`}
              data-testid={`questionnaire-install-status-${status.questionnaireName}`}
            >
              {statusText}
            </span>
          </td>
        </tr>
      );
    });
  }

  render(): ReactElement {
    if (this.state.loading) {
      return <LoadingPanel message={"Getting questionnaire install status."} />;
    }

    if (this.state.errored) {
      return <Panel>Unable to get questionnaire install status.</Panel>;
    }

    if (this.state.installStatuses.length === 0) {
      return <Panel>No questionnaire install status data.</Panel>;
    }

    return (
      <Table
        columns={["Questionnaire", "Active nodes", "Install status"]}
        id="questionnaire-install-status-table"
      >
        <>{this.renderRows()}</>
      </Table>
    );
  }
}
