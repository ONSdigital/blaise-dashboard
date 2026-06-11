import { render, screen, waitFor } from "@testing-library/react";
import CawiLoginSuccessChart from "./cawiLoginSuccessChart";
import * as cawiLoginCountsApi from "../api/cawiLoginCounts";

const getCawiLoginSuccessCountsSpy = vi.spyOn(cawiLoginCountsApi, "getCawiLoginSuccessCounts");

describe("CawiLoginSuccessChart", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders line chart and total count", async () => {
        getCawiLoginSuccessCountsSpy.mockResolvedValue([
            { timestamp: "2026-06-11T10:00:00.000Z", count: 2 },
            { timestamp: "2026-06-11T11:00:00.000Z", count: 3 },
            { timestamp: "2026-06-11T12:00:00.000Z", count: 4 }
        ]);

        render(<CawiLoginSuccessChart />);

        await waitFor(() => {
            expect(screen.getByTestId("cawi-login-total").textContent).toContain("9");
            expect(screen.getByTestId("cawi-login-line-chart")).toBeInTheDocument();
        });
    });

    it("renders error panel when request fails", async () => {
        getCawiLoginSuccessCountsSpy.mockRejectedValue(new Error("boom"));

        render(<CawiLoginSuccessChart />);

        await waitFor(() => {
            expect(screen.getByText("Unable to get CAWI successful login counts.")).toBeInTheDocument();
        });
    });

    it("renders API error details when available", async () => {
        getCawiLoginSuccessCountsSpy.mockRejectedValue({
            response: {
                data: "Denied"
            }
        });

        render(<CawiLoginSuccessChart />);

        await waitFor(() => {
            expect(screen.getByText("Denied")).toBeInTheDocument();
        });
    });

    it("falls back to default error message when API error payload is blank", async () => {
        getCawiLoginSuccessCountsSpy.mockRejectedValue({
            response: {
                data: "   "
            }
        });

        render(<CawiLoginSuccessChart />);

        await waitFor(() => {
            expect(screen.getByText("Unable to get CAWI successful login counts.")).toBeInTheDocument();
        });
    });

    it("renders empty message when no data", async () => {
        getCawiLoginSuccessCountsSpy.mockResolvedValue([]);

        render(<CawiLoginSuccessChart />);

        await waitFor(() => {
            expect(screen.getByText("No successful CAWI login data found in the last 24 hours.")).toBeInTheDocument();
        });
    });

    it("renders single-point chart and keeps invalid timestamp labels", async () => {
        getCawiLoginSuccessCountsSpy.mockResolvedValue([
            { timestamp: "invalid", count: 1 }
        ]);

        render(<CawiLoginSuccessChart />);

        await waitFor(() => {
            expect(screen.getByTestId("cawi-login-line-chart").textContent).toContain("invalid");
        });
    });

});
