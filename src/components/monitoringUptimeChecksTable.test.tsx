/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { mockHealthCheckList } from "../server/blaiseApi/testFixtures";

import MonitoringUptimeChecksTable from "./monitoringUptimeChecksTable";

describe("Monitoring Uptime Checks Table", () => {
    it("renders a table row for the uptime checks", async () => {
        render(
            <MonitoringUptimeChecksTable monitoringData={mockHealthCheckList} />
        );

        expect(screen.getByTestId("uptimecheck-dev-bts.social-surveys.gcp.onsdigital.uk").textContent).toEqual("dev-bts.social-surveys.gcp.onsdigital.uk");
        expect(screen.getByTestId("uptimecheck-europe").className).toContain("ons-status--success");
        expect(screen.getByTestId("uptimecheck-asia").className).toContain("ons-status--error");
        expect(screen.getByTestId("uptimecheck-northAmerica").className).toContain("ons-status--success");
        expect(screen.getByTestId("uptimecheck-southAmerica").className).toContain("ons-status--requestFailed");
        expect(screen.getByTestId("healthCheck-table")).toMatchSnapshot();
        
    });

    it("shows an error panel if uptime checks array passed is empty", async () => {
        render(
            <MonitoringUptimeChecksTable monitoringData={[]} />
        );

        expect(await screen.findByText("Failed uptime checks data fetch....")).toBeDefined();
    });
});
