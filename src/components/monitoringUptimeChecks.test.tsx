/**
 * @jest-environment jsdom
 */


import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MonitoringUptimeChecks from "./monitoringUptimeChecks";

describe("MonitoringUptimeChecks", () => {
    it("renders a table row for the uptimecheck", async () => {
        render(
            <table>
                <tbody>
                    <MonitoringUptimeChecks hostname={"dev-bts.social-surveys.gcp.onsdigital.uk"} eurBelgium={"success"} apacSingapore={"error"} northAmerica={"success"} southAmerica={"requestFailed"}/>
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.getByTestId("uptimecheck-dev-bts.social-surveys.gcp.onsdigital.uk").textContent).toEqual("dev-bts.social-surveys.gcp.onsdigital.uk");
            expect(screen.getByTestId("uptimecheck-europe").className).toContain("success");
            expect(screen.getByTestId("uptimecheck-asia").className).toContain("error");
            expect(screen.getByTestId("uptimecheck-northAmerica").className).toContain("success");
            expect(screen.getByTestId("uptimecheck-southAmerica").className).toContain("requestFailed");
        });
    });
});
