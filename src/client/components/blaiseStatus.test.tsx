import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BlaiseStatusPanel from "./blaiseStatus";
import * as blaiseStatusApi from "../api/blaiseStatus";

const getBlaiseStatusSpy = vi.spyOn(blaiseStatusApi, "getBlaiseStatus");

describe("Blaise Status Panel", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("renders the Blaise status list", async () => {
        getBlaiseStatusSpy.mockResolvedValue([
            { "health check type": "Connection model", status: "OK" },
            { "health check type": "Blaise connection", status: "FAIL" }
        ]);

        render(<BlaiseStatusPanel />);

        expect(screen.getByText("Loading Blaise status.")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Connection model")).toBeInTheDocument();
            expect(screen.getByText("Blaise connection")).toBeInTheDocument();
            expect(screen.getByTestId("blaise-status-connection-model").className).toContain("ons-status--success");
            expect(screen.getByTestId("blaise-status-blaise-connection").className).toContain("ons-status--error");
        });
    });

    it("shows an error message when the API fails", async () => {
        getBlaiseStatusSpy.mockRejectedValue(new Error("server error"));

        render(<BlaiseStatusPanel />);

        await waitFor(() => {
            expect(screen.getByTestId("blaise-status-info-panel")).toBeInTheDocument();
            expect(screen.getByText("Unable to get Blaise status")).toBeInTheDocument();
        });
    });

    it("shows a no details message when the response list is empty", async () => {
        getBlaiseStatusSpy.mockResolvedValue([]);

        render(<BlaiseStatusPanel />);

        await waitFor(() => {
            expect(screen.getByText("No connection details found.")).toBeInTheDocument();
        });
    });
});