import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ErrorLogsTable from "./errorLogsTable";
import * as errorLogsApi from "../api/errorLogs";

const getErrorLogsSpy = vi.spyOn(errorLogsApi, "getErrorLogs");

describe("ErrorLogsTable", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders timestamp and log columns", async () => {
        getErrorLogsSpy.mockResolvedValue([
            { timestamp: "2026-06-11T10:00:00.000Z", log: "Error one" },
            { timestamp: "2026-06-11T09:30:00.000Z", log: "Error two" }
        ]);

        render(<ErrorLogsTable scope="blaise" />);

        await waitFor(() => {
            expect(screen.getByText("11/06/2026 10:00:00")).toBeInTheDocument();
            expect(screen.getByText("Error one")).toBeInTheDocument();
            expect(screen.getByText("11/06/2026 09:30:00")).toBeInTheDocument();
            expect(screen.getByText("Error two")).toBeInTheDocument();
        });

        const rows = screen.getAllByTestId("error-log-row");
        rows.forEach((row) => {
            expect(row.querySelectorAll("td")).toHaveLength(2);
        });

        expect(getErrorLogsSpy).toHaveBeenCalledWith("blaise");
    });

    it("renders error panel when API fails", async () => {
        getErrorLogsSpy.mockRejectedValue(new Error("boom"));

        render(<ErrorLogsTable scope="non-blaise" />);

        await waitFor(() => {
            expect(screen.getByText("Unable to get non-blaise GCP error logs.")).toBeInTheDocument();
        });
    });

    it("renders API error details when available", async () => {
        getErrorLogsSpy.mockRejectedValue({
            response: {
                data: "Denied"
            }
        });

        render(<ErrorLogsTable scope="non-blaise" />);

        await waitFor(() => {
            expect(screen.getByText("Denied")).toBeInTheDocument();
        });
    });

    it("falls back to default scope message when API error payload is blank", async () => {
        getErrorLogsSpy.mockRejectedValue({
            response: {
                data: "   "
            }
        });

        render(<ErrorLogsTable scope="non-blaise" />);

        await waitFor(() => {
            expect(screen.getByText("Unable to get non-blaise GCP error logs.")).toBeInTheDocument();
        });
    });

    it("renders empty-state panel when no logs", async () => {
        getErrorLogsSpy.mockResolvedValue([]);

        render(<ErrorLogsTable scope="non-blaise" />);

        await waitFor(() => {
            expect(screen.getByText("No non-Blaise error logs found in the last 24 hours.")).toBeInTheDocument();
        });
    });

    it("supports first/last navigation and rows-per-page selection", async () => {
        const logs = Array.from({ length: 120 }, (_unused, index) => ({
            timestamp: `2026-06-11T10:${String(index).padStart(2, "0")}:00.000Z`,
            log: `Error ${index}`
        }));
        getErrorLogsSpy.mockResolvedValue(logs);

        render(<ErrorLogsTable scope="non-blaise" />);

        await waitFor(() => {
            expect(screen.getAllByTestId("error-log-row")).toHaveLength(20);
            expect(screen.getByTestId("error-logs-page-indicator").textContent).toContain("Page 1 of 6");
        });

        fireEvent.click(screen.getByTestId("error-logs-last"));

        await waitFor(() => {
            expect(screen.getAllByTestId("error-log-row")).toHaveLength(20);
            expect(screen.getByTestId("error-logs-page-indicator").textContent).toContain("Page 6 of 6");
        });

        fireEvent.click(screen.getByTestId("error-logs-first"));

        await waitFor(() => {
            expect(screen.getAllByTestId("error-log-row")).toHaveLength(20);
            expect(screen.getByTestId("error-logs-page-indicator").textContent).toContain("Page 1 of 6");
        });

        fireEvent.click(screen.getByTestId("error-logs-rows-per-page-option-50"));

        await waitFor(() => {
            expect(screen.getAllByTestId("error-log-row")).toHaveLength(50);
            expect(screen.getByTestId("error-logs-page-indicator").textContent).toContain("Page 1 of 3");
        });

        fireEvent.click(screen.getByTestId("error-logs-next"));

        await waitFor(() => {
            expect(screen.getAllByTestId("error-log-row")).toHaveLength(50);
            expect(screen.getByTestId("error-logs-page-indicator").textContent).toContain("Page 2 of 3");
        });

        fireEvent.click(screen.getByTestId("error-logs-prev"));

        await waitFor(() => {
            expect(screen.getByTestId("error-logs-page-indicator").textContent).toContain("Page 1 of 3");
        });
    });

    it("keeps original timestamp text when timestamp is invalid", async () => {
        getErrorLogsSpy.mockResolvedValue([
            { timestamp: "not-a-date", log: "Raw error" }
        ]);

        render(<ErrorLogsTable scope="restapi" />);

        await waitFor(() => {
            expect(screen.getByText("not-a-date")).toBeInTheDocument();
            expect(screen.getByText("Raw error")).toBeInTheDocument();
        });
    });

});