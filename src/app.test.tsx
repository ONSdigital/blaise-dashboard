/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import App from "./app";
import { mockQuestionnaireList } from "./server/blaiseApi/testFixtures";

jest.mock("./client/caseCompletionReport");
import { getCaseCompletionReport } from "./client/caseCompletionReport";
import { CaseCompletionReport } from "./server/blaiseApi/caseCompletionReport";

jest.mock("./client/questionnaires");
import { getQuestionnaires } from "./client/questionnaires";
import { Questionnaire } from "blaise-api-node-client";

jest.mock("./client/monitoring");
import { getMonitoring } from "./client/monitoring";
import { MonitoringDataModel } from "./server/monitoringDataModel";

const flushPromises = () => new Promise(setImmediate);

const getCaseCompletionReportMock = getCaseCompletionReport as jest.Mock<Promise<CaseCompletionReport>>;
const getQuestionnairesMock = getQuestionnaires as jest.Mock<Promise<Questionnaire[]>>;
const getMonitoringMock = getMonitoring as jest.Mock<Promise<MonitoringDataModel[]>>;

describe("App", () => {
  const caseCompletionReport = {
    Total: 7,
    Complete: 5,
    NotComplete: 2,
    CompletePercentage: 71.43
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders correctly", async () => {
    getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));
    getQuestionnairesMock.mockImplementation(() => Promise.resolve(mockQuestionnaireList));
    getMonitoringMock.mockImplementation(() => Promise.resolve([]));

    const app = render(
      <App />
    );

    expect(screen.findByText(/Loading/i)).toBeDefined(); //doesnt work
    expect(screen.findByText(/What is sa completed case/i)).toBeDefined();  //doesnt work
    expect(await screen.findByText("Service health check information")).toBeDefined();
    expect(screen.findByText("Getting ssuptime checks for services")).toBeDefined();   //doesnt work
    await act(async () => {
      await flushPromises();
    });

    await waitFor(() => {
      expect(app).toMatchSnapshot();
    });
  });

  describe("when getting case completion reports errors", () => {
    it("renders an error panel", async () => {
      getQuestionnairesMock.mockImplementation(() => Promise.reject("Cannot get questionnaires"));
      getMonitoringMock.mockImplementation(() => Promise.resolve([]));

      render(
        <App />
      );

      expect(await screen.findByText("Failed to get questionnaires.")).toBeDefined();
      expect(screen.queryByText(/What is a completed case/i)).not.toBeUndefined(); //doesnt work
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

      expect(screen.queryByText(/Loading/i)).toBeDefined();  //deosnt work
      expect(await screen.findByText("No questionnaires installed.")).toBeDefined();
      expect(screen.findByText(/What is a completed case/i)).not.toBeUndefined();
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

      expect(await screen.findByText("No uptime checks data.")).toBeDefined();
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

      expect(await screen.findByText("Failed to get uptime checks.")).toBeDefined();
    });
  });

});
