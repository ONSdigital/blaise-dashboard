import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import InstrumentCaseReport from "./instrumentCaseReport";

describe("InstrumentCaseReport", () => {
    const caseCompletionReport = {
        Total: 7,
        Complete: 5,
        NotComplete: 2,
        CompletePercentage: 71.43
    }
    it("renders a table row for the instrument case status", async () => {
      render(
          <table>
              <tbody>
                    <InstrumentCaseReport caseCompletionReport={caseCompletionReport} instrumentName={"opn2101a"} />
              </tbody>
          </table>
      );

      await waitFor(() => {
        expect(screen.getByTestId("instrument-case-report-questionnaire-opn2101a").textContent).toEqual("opn2101a");
        expect(screen.getByTestId("instrument-case-report-total-opn2101a").textContent).toEqual("7");
        expect(screen.getByTestId("instrument-case-report-complete-opn2101a").textContent).toEqual("5 (71.43%)");
      });
    })
})