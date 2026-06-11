import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import QuestionnaireInstallStatusPanel from "./questionnaireInstallStatus";
import * as installStatusApi from "../api/questionnaireInstallStatus";

const getQuestionnaireInstallStatusSpy = vi.spyOn(installStatusApi, "getQuestionnaireInstallStatus");

describe("Questionnaire Install Status Panel", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("shows active only when active on all nodes", async () => {
        getQuestionnaireInstallStatusSpy.mockResolvedValue([
            {
                questionnaireName: "OPN2101A",
                totalNodes: 3,
                activeNodes: 3,
                activeOnAllNodes: true
            },
            {
                questionnaireName: "LMS2101A",
                totalNodes: 3,
                activeNodes: 2,
                activeOnAllNodes: false
            }
        ]);

        render(<QuestionnaireInstallStatusPanel />);

        await waitFor(() => {
            expect(screen.getByText("OPN2101A")).toBeInTheDocument();
            expect(screen.getByText("LMS2101A")).toBeInTheDocument();
            expect(screen.getByText("3/3")).toBeInTheDocument();
            expect(screen.getByText("2/3")).toBeInTheDocument();
            expect(screen.getByTestId("questionnaire-install-status-OPN2101A").className).toContain("ons-status--success");
            expect(screen.getByTestId("questionnaire-install-status-LMS2101A").className).toContain("ons-status--error");
            expect(screen.getByText("Not active on all nodes")).toBeInTheDocument();
        });
    });

    it("shows an error panel when API request fails", async () => {
        getQuestionnaireInstallStatusSpy.mockRejectedValue(new Error("failed"));

        render(<QuestionnaireInstallStatusPanel />);

        await waitFor(() => {
            expect(screen.getByText("Unable to get questionnaire install status.")).toBeInTheDocument();
        });
    });

    it("shows an info panel when no install status data is returned", async () => {
        getQuestionnaireInstallStatusSpy.mockResolvedValue([]);

        render(<QuestionnaireInstallStatusPanel />);

        await waitFor(() => {
            expect(screen.getByText("No questionnaire install status data.")).toBeInTheDocument();
        });
    });
});