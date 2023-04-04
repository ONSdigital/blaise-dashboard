/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("../client/monitoring");
import { getMonitoring } from "../client/monitoring";

import { MonitoringDataModel } from "../server/monitoringDataModel";
import { mockHealthCheckList } from "../server/blaiseApi/testFixtures";

import MonitoringUptimeChecksTable from "./monitoringUptimeChecksTable";

const getMonitoringMock = getMonitoring as jest.Mock<Promise<MonitoringDataModel[]>>;

describe("Monitoring Uptime Checks Table", () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("renders a table row for the uptime checks", async () => {
        getMonitoringMock.mockImplementation(() => Promise.resolve(mockHealthCheckList));

        render(
            <MonitoringUptimeChecksTable monitoringData={mockHealthCheckList} />
        );

        expect((await screen.findByTestId("uptimecheck-dev-bts.social-surveys.gcp.onsdigital.uk")).textContent).toEqual("dev-bts.social-surveys.gcp.onsdigital.uk");
        expect(screen.getByTestId("uptimecheck-europe").className).toContain("ons-status--success");
        expect(screen.getByTestId("uptimecheck-asia").className).toContain("ons-status--error");
        expect(screen.getByTestId("uptimecheck-northAmerica").className).toContain("ons-status--success");
        expect(screen.getByTestId("uptimecheck-southAmerica").className).toContain("ons-status--requestFailed");
        expect(screen.getByTestId("healthCheck-table")).toMatchSnapshot();
        
    });

    it("shows an error panel if uptime checks array passed is empty", async () => {
        getMonitoringMock.mockImplementation(() => Promise.reject("Failed to get uptime checks"));

        render(
            <MonitoringUptimeChecksTable monitoringData={[]} />
        );

        expect(await screen.findByText("Failed uptime checks data fetch....")).toBeDefined();
        
    });

});
