import { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LoadingPanel,
  Panel,
  Table,
} from "blaise-design-system-react-components";
import {
  getQuestionnaireInstallStatus,
  QuestionnaireInstallStatus,
} from "../api/questionnaireInstallStatus";

function renderRows(
  installStatuses: QuestionnaireInstallStatus[],
): ReactElement[] {
  return installStatuses.map((status) => {
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

export default function QuestionnaireInstallStatusPanel(): ReactElement {
  const installStatusQuery = useQuery<QuestionnaireInstallStatus[]>({
    queryKey: ["questionnaire-install-status"],
    queryFn: getQuestionnaireInstallStatus,
    staleTime: 30 * 1000,
  });

  const installStatuses = installStatusQuery.data ?? [];

  if (installStatusQuery.isLoading) {
    return <LoadingPanel message={"Getting questionnaire install status."} />;
  }

  if (installStatusQuery.isError) {
    return <Panel>Unable to get questionnaire install status.</Panel>;
  }

  if (installStatuses.length === 0) {
    return <Panel>No questionnaire install status data.</Panel>;
  }

  return (
    <Table
      columns={["Questionnaire", "Active nodes", "Install status"]}
      id="questionnaire-install-status-table"
    >
      <>{renderRows(installStatuses)}</>
    </Table>
  );
}
