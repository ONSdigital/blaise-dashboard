import React, { ReactElement } from "react";
import type { Questionnaire } from "blaise-api-node-client";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  Footer,
  Header,
  LoadingPanel,
  Panel,
} from "blaise-design-system-react-components";
import { getQuestionnaires } from "./api/questionnaires";
import QuestionnaireCaseReportTable from "./components/questionnaireCaseReportTable";
import { getMonitoring } from "./api/monitoring";
import { MonitoringDataModel } from "./types/monitoringDataModel";
import MonitoringUptimeChecksTable from "./components/monitoringUptimeChecksTable";
import BlaiseStatusPanel from "./components/blaiseStatus";
import QuestionnaireInstallStatusPanel from "./components/questionnaireInstallStatus";
import ErrorLogsTable from "./components/errorLogsTable";
import CawiLoginSuccessChart from "./components/cawiLoginSuccessChart";
import { extractResponseErrorMessage } from "./api/errorMessage";

const pageContainerStyle = {
  minHeight: "calc(67vh)",
};

export default function App(): ReactElement {
  const questionnairesQuery = useQuery({
    queryKey: ["questionnaires"],
    queryFn: getQuestionnaires,
    staleTime: 5 * 60 * 1000,
  });

  const monitoringQuery = useQuery<MonitoringDataModel[]>({
    queryKey: ["monitoring"],
    queryFn: getMonitoring,
    staleTime: 30 * 1000,
  });

  const questionnaires: Questionnaire[] = (
    questionnairesQuery.data ?? []
  ).filter((questionnaire) => !/^IPS/i.test(questionnaire.name));
  const uptimeChecks = monitoringQuery.data ?? [];
  const uptimeChecksErrorMessage = monitoringQuery.isError
    ? extractResponseErrorMessage(
        monitoringQuery.error,
        "Failed to get uptime checks.",
      )
    : "";

  function renderQuestionnaireErrorPanel(): ReactElement | undefined {
    if (questionnairesQuery.isError) {
      return <Panel status="error">Failed to get questionnaires.</Panel>;
    }
    return undefined;
  }

  function renderUptimeChecksErrorPanel(): ReactElement | undefined {
    if (monitoringQuery.isError) {
      return <Panel status="error">{uptimeChecksErrorMessage}</Panel>;
    }
    return undefined;
  }

  function renderQuestionnaireLoadingPanel(): ReactElement | undefined {
    if (questionnairesQuery.isLoading && !questionnairesQuery.isError) {
      return <LoadingPanel message={"Getting questionnaires for report"} />;
    }
    return undefined;
  }

  function renderUptimeChecksLoadingPanel(): ReactElement | undefined {
    if (monitoringQuery.isLoading) {
      return <LoadingPanel message={"Getting uptime checks for services"} />;
    }
    return undefined;
  }

  function renderQuestionnaireReportTable(): ReactElement | undefined {
    if (questionnairesQuery.isLoading || questionnairesQuery.isError) {
      return undefined;
    }
    if (questionnaires.length === 0) {
      return <Panel>No questionnaires installed.</Panel>;
    }
    return <QuestionnaireCaseReportTable questionnaires={questionnaires} />;
  }

  function renderCompletedCaseDefinition(): ReactElement | undefined {
    if (!questionnairesQuery.isLoading && questionnaires.length !== 0) {
      return (
        <Collapsible title="What is a completed case?">
          <>
            <p>
              Completed cases are cases that do <strong>NOT</strong> have any of
              the following outcome codes:
            </p>
            <ul className="ons-list">
              <li className="ons-list__item">0 - Not actioned</li>
              <li className="ons-list__item">210 - Partial</li>
              <li className="ons-list__item">300 - Appointment made</li>
              <li className="ons-list__item">310 - Non-contact</li>
            </ul>
          </>
        </Collapsible>
      );
    }
    return undefined;
  }

  function renderServiceHealthCheck(): ReactElement | undefined {
    if (monitoringQuery.isLoading || monitoringQuery.isError) {
      return undefined;
    }
    if (uptimeChecks.length === 0) {
      return <Panel>No uptime checks data.</Panel>;
    }
    return <MonitoringUptimeChecksTable monitoringData={uptimeChecks} />;
  }

  return (
    <>
      <Header title={"Dashboard"} />
      <div
        style={pageContainerStyle}
        className="ons-page__container ons-container"
      >
        <main id="main-content" className="ons-page__main ons-u-mt-no">
          <h2 className="ons-u-mt-m">Service uptime status</h2>
          {renderUptimeChecksLoadingPanel()}
          {renderUptimeChecksErrorPanel()}
          {renderServiceHealthCheck()}
          <h2 className="ons-u-mt-m">Blaise health check status</h2>
          <BlaiseStatusPanel />
          <h2 className="ons-u-mt-m">Questionnaire install status</h2>
          <QuestionnaireInstallStatusPanel />
          <h2 className="ons-u-mt-m">Case completion status</h2>
          {renderQuestionnaireErrorPanel()}
          {renderQuestionnaireLoadingPanel()}
          {renderQuestionnaireReportTable()}
          {renderCompletedCaseDefinition()}
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
      <Footer />
    </>
  );
}
