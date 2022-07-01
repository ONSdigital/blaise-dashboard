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

const flushPromises = () => new Promise(setImmediate);

const getCaseCompletionReportMock = getCaseCompletionReport as jest.Mock<Promise<CaseCompletionReport>>;
const getQuestionnairesMock = getQuestionnaires as jest.Mock<Promise<Questionnaire[]>>;


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

    const app = render(
      <App />
    );

    expect(screen.queryByText(/Loading/i)).toBeDefined();
    expect(screen.queryByText(/What is a completed case/i)).toBeDefined();

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

      render(
        <App />
      );

      await waitFor(() => {
        expect(screen.getByText("Failed to get questionnaires.")).toBeDefined();
        expect(screen.queryByText(/What is a completed case/i)).not.toBeUndefined();
      });
    });
  });


  describe("when no questionnaires are installed", () => {
    it("renders an info panel", async () => {
      getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));
      getQuestionnairesMock.mockImplementation(() => Promise.resolve([]));

      render(
        <App />
      );

      expect(screen.queryByText(/Loading/i)).toBeDefined();

      await waitFor(() => {
        expect(screen.getByText("No questionnaires installed.")).toBeDefined();
        expect(screen.queryByText(/What is a completed case/i)).not.toBeUndefined();
      });
    });
  });
});
