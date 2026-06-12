import { render, screen } from "@testing-library/react";
import { mockHealthCheckList } from "../../server/blaiseApi/testFixtures";

import MonitoringUptimeChecksTable from "./monitoringUptimeChecksTable";

describe("Monitoring Uptime Checks Table", () => {
  it("renders a table row for the uptime checks", async () => {
    render(
      <MonitoringUptimeChecksTable monitoringData={mockHealthCheckList} />,
    );

    expect(
      screen.getByTestId("uptimecheck-dev-bts.social-surveys.gcp.onsdigital.uk")
        .textContent,
    ).toEqual("dev-bts.social-surveys.gcp.onsdigital.uk");
    expect(screen.getByTestId("uptimecheck-europe").className).toContain(
      "ons-status--success",
    );
    expect(screen.getByTestId("uptimecheck-asia").className).toContain(
      "ons-status--error",
    );
    expect(screen.getByTestId("uptimecheck-northAmerica").className).toContain(
      "ons-status--success",
    );
    expect(screen.getByTestId("uptimecheck-southAmerica").className).toContain(
      "ons-status--dead",
    );
    const rows = screen.getAllByTestId("monitoring-table-row");
    rows.forEach((row) => {
      expect(row.querySelectorAll("td")).toHaveLength(5);
    });
    expect(screen.getByTestId("healthCheck-table")).toMatchSnapshot();
  });

  it("renders an empty table when uptime checks array is empty", () => {
    render(<MonitoringUptimeChecksTable monitoringData={[]} />);

    expect(
      screen.queryByText("Failed uptime checks data fetch...."),
    ).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("monitoring-table-row")).toHaveLength(0);
  });

  it("shows dead status when region data is incomplete", async () => {
    render(
      <MonitoringUptimeChecksTable
        monitoringData={[
          {
            hostname: "partial-host",
            regions: [{ region: "europe", status: "success" }],
          },
        ]}
      />,
    );

    expect(screen.getByTestId("uptimecheck-partial-host").textContent).toEqual(
      "partial-host",
    );
    expect(screen.getByTestId("uptimecheck-europe").className).toContain(
      "ons-status--success",
    );
    expect(screen.getByTestId("uptimecheck-asia").className).toContain(
      "ons-status--dead",
    );
    expect(screen.getByTestId("uptimecheck-northAmerica").className).toContain(
      "ons-status--dead",
    );
    expect(screen.getByTestId("uptimecheck-southAmerica").className).toContain(
      "ons-status--dead",
    );
  });
});
