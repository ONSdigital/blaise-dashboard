import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./app";
import { mockQuestionnaireList } from "./server/blaiseApi/testFixtures";

vi.mock("./client/caseCompletionReport");
import { getCaseCompletionReport } from "./client/caseCompletionReport";

vi.mock("./client/questionnaires");
import { getQuestionnaires } from "./client/questionnaires";

vi.mock("./client/monitoring");
import { getMonitoring } from "./client/monitoring";

const getCaseCompletionReportMock = vi.mocked(getCaseCompletionReport);
const getQuestionnairesMock = vi.mocked(getQuestionnaires);
const getMonitoringMock = vi.mocked(getMonitoring);

describe("App", () => {
  const caseCompletionReport = {
    Total: 7,
    Complete: 5,
    NotComplete: 2,
    CompletePercentage: 71.43
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly", async () => {
    getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));
    getQuestionnairesMock.mockImplementation(() => Promise.resolve(mockQuestionnaireList));
    getMonitoringMock.mockImplementation(() => Promise.resolve([]));

    const app = render(
      <App />
    );

    expect(screen.getByText("Getting questionnaires for report")).toBeVisible();
    expect(screen.getByText("Getting uptime checks for services")).toBeVisible();
    expect(await screen.findByText("What is a completed case?")).toBeVisible();
    expect(await screen.findByText("Service health check information")).toBeVisible();
    expect(screen.queryByText("Getting questionnaires for report")).not.toBeInTheDocument();
    expect(screen.queryByText("Getting uptime checks for services")).not.toBeInTheDocument();
    expect(app).toMatchSnapshot();

  });

  describe("when getting case completion reports errors", () => {
    it("renders an error panel", async () => {
      getQuestionnairesMock.mockImplementation(() => Promise.reject("Cannot get questionnaires"));
      getMonitoringMock.mockImplementation(() => Promise.resolve([]));

      render(
        <App />
      );

      expect(await screen.findByText("Failed to get questionnaires.")).toBeVisible();
    });
  });


  describe("when no questionnaires are installed", () => {
    it("renders an info panel", async () => {
      getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));
      getQuestionnairesMock.mockImplementation(() => Promise.resolve([]));
      getMonitoringMock.mockImplementation(() => Promise.resolve([]));

      render(
        <App />
      );

      expect(await screen.findByText("No questionnaires installed.")).toBeVisible();
    });
  });

  describe("when questionnaires include IPA prefixes", () => {
    it("excludes IPA questionnaires from completed case information", async () => {
      getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));
      getQuestionnairesMock.mockImplementation(() => Promise.resolve([
        {
          name: "IPA2101A",
          installDate: "210122",
          serverParkName: "gusty",
          fieldPeriod: "210122"
        },
        {
          name: "OPN2101A",
          installDate: "210122",
          serverParkName: "gusty",
          fieldPeriod: "210122"
        }
      ]));
      getMonitoringMock.mockImplementation(() => Promise.resolve([]));

      render(
        <App />
      );

      expect(await screen.findByTestId("questionnaire-case-report-questionnaire-OPN2101A")).toBeVisible();
      expect(screen.queryByTestId("questionnaire-case-report-questionnaire-IPA2101A")).not.toBeInTheDocument();
      expect(getCaseCompletionReportMock).not.toHaveBeenCalledWith("IPA2101A");
    });
  });

  describe("when no uptime checks are returned or empty response", () => {
    it("renders an info panel", async () => {
      getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));
      getQuestionnairesMock.mockImplementation(() => Promise.resolve([]));
      getMonitoringMock.mockImplementation(() => Promise.resolve([]));

      render(
        <App />
      );

      expect(await screen.findByText("No uptime checks data.")).toBeVisible();
    });
  });

  describe("when error occurs retreiving uptime checks", () => {
    it("renders an error panel", async () => {
      getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));
      getQuestionnairesMock.mockImplementation(() => Promise.resolve([]));
      getMonitoringMock.mockImplementation(() => Promise.reject("Cannot get uptime checks"));

      render(
        <App />
      );

      expect(await screen.findByText("Failed to get uptime checks.")).toBeVisible();
      expect(screen.queryByText("No uptime checks data.")).not.toBeInTheDocument();
    });

    it("renders API error details when available", async () => {
      getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));
      getQuestionnairesMock.mockImplementation(() => Promise.resolve([]));
      getMonitoringMock.mockImplementation(() => Promise.reject({
        response: {
          data: "Failed to get monitoring uptimeChecks config data: PERMISSION_DENIED"
        }
      }));

      render(
        <App />
      );

      expect(await screen.findByText("Failed to get monitoring uptimeChecks config data: PERMISSION_DENIED")).toBeVisible();
      expect(screen.queryByText("No uptime checks data.")).not.toBeInTheDocument();
    });
  });

});
