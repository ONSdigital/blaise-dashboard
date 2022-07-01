/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import QuestionnaireCaseReportTable from "./questionnaireCaseReportTable";
import { mockQuestionnaireList } from "../server/blaiseApi/testFixtures";

jest.mock("../client/caseCompletionReport");
import { getCaseCompletionReport } from "../client/caseCompletionReport";
import { CaseCompletionReport } from "../server/blaiseApi/caseCompletionReport";

const getCaseCompletionReportMock = getCaseCompletionReport as jest.Mock<Promise<CaseCompletionReport>>;


describe("QuestionnaireCaseReportTable", () => {
    const caseCompletionReport = {
        Total: 7,
        Complete: 5,
        NotComplete: 2,
        CompletePercentage: 71.43
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("renders a table row for the questionnaire case status", async () => {
        getCaseCompletionReportMock.mockImplementation(() => Promise.resolve(caseCompletionReport));

        render(
            <QuestionnaireCaseReportTable questionnaires={mockQuestionnaireList} />
        );

        expect(screen.queryByText(/Loading/i)).toBeDefined();

        await waitFor(() => {
            expect(screen.getByTestId("questionnaire-case-report-questionnaire-OPN2101A").textContent).toEqual("OPN2101A");
            expect(screen.getByTestId("questionnaire-case-report-total-OPN2101A").textContent).toEqual("7");
            expect(screen.getByTestId("questionnaire-case-report-complete-OPN2101A").textContent).toEqual("5 (71.43%)");
            expect(screen.getByTestId("questionnaire-case-report-complete-percentage-OPN2101A").innerHTML).toEqual(
                "<progress id=\"file\" value=\"71.43\" max=\"100\" role=\"progressbar\" aria-valuenow=\"71.43\" aria-valuemin=\"0\" aria-valuemax=\"100\">71.43%</progress>"
            );
            expect(screen.getByTestId("case-report-table")).toMatchSnapshot();
        });
    });

    describe("when getting case completion reports errors", () => {
        it("renders an error panel", async () => {
            getCaseCompletionReportMock.mockImplementation(() => Promise.reject("Cannot get case completion reports"));

            render(
                <QuestionnaireCaseReportTable questionnaires={mockQuestionnaireList} />
            );

            await waitFor(() => {
                expect(screen.getByText("Failed to get completion reports for questionnaires: LMS2101_CC1, OPN2101A, OPN2007T")).toBeDefined();
            });
        });
    });
});
