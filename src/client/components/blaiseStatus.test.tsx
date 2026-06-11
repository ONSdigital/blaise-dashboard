import { render, screen, waitFor } from "@testing-library/react";
import BlaiseStatusPanel from "./blaiseStatus";
import * as blaiseStatusApi from "../api/blaiseStatus";

const getBlaiseStatusSpy = vi.spyOn(blaiseStatusApi, "getBlaiseStatus");

describe("Blaise Status Panel", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
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

        const rows = screen.getAllByRole("row").slice(1);
        rows.forEach((row) => {
            expect(row.querySelectorAll("td")).toHaveLength(2);
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

    it("renders without crashing when API uses healthCheckType field", async () => {
        getBlaiseStatusSpy.mockResolvedValue([
            { healthCheckType: "Connection model", status: "OK" }
        ]);

        render(<BlaiseStatusPanel />);

        await waitFor(() => {
            expect(screen.getByText("Connection model")).toBeInTheDocument();
            expect(screen.getByTestId("blaise-status-connection-model").className).toContain("ons-status--success");
        });
    });

    it("shows error when API returns a non-array payload", async () => {
        getBlaiseStatusSpy.mockResolvedValue({ unexpected: true } as unknown as never);

        render(<BlaiseStatusPanel />);

        await waitFor(() => {
            expect(screen.getByText("Unable to get Blaise status")).toBeInTheDocument();
        });
    });

    it("uses unknown fallbacks for empty health check type and status", async () => {
        getBlaiseStatusSpy.mockResolvedValue([
            { "health check type": "", status: "" }
        ]);

        render(<BlaiseStatusPanel />);

        await waitFor(() => {
            expect(screen.getByText("Unknown health check")).toBeInTheDocument();
            expect(screen.getByText("Unknown")).toBeInTheDocument();
        });
    });

    it("ignores malformed rows and still renders valid status items", async () => {
        getBlaiseStatusSpy.mockResolvedValue([
            null,
            { "health check type": "Connection model", status: "OK" }
        ] as unknown as never);

        render(<BlaiseStatusPanel />);

        await waitFor(() => {
            expect(screen.getByText("Connection model")).toBeInTheDocument();
            expect(screen.getByTestId("blaise-status-connection-model").className).toContain("ons-status--success");
        });
    });

});