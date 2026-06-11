import { Component, ReactElement } from "react";

type MonitoringUptimeChecksProps = {
  hostname: string;
  eurBelgium: string;
  apacSingapore: string;
  northAmerica: string;
  southAmerica: string;
};

export default class MonitoringUptimeChecks extends Component<MonitoringUptimeChecksProps> {
  constructor(props: MonitoringUptimeChecksProps) {
    super(props);
  }

  getStatusColor(status: string | undefined): "success" | "error" | "dead" {
    const normalizedStatus = status?.trim().toLowerCase();

    if (normalizedStatus === "success" || normalizedStatus === "true") {
      return "success";
    }

    if (normalizedStatus === "error" || normalizedStatus === "false") {
      return "error";
    }

    return "dead";
  }

  render(): ReactElement {
    return (
      <tr
        className="ons-table__row"
        key={this.props.hostname}
        data-testid="monitoring-table-row"
      >
        <td
          className="ons-table__cell"
          data-testid={`uptimecheck-${this.props.hostname}`}
        >
          {this.props.hostname}
        </td>
        <td className="ons-table__cell">
          <span
            data-testid="uptimecheck-europe"
            className={`ons-status ons-status--${this.getStatusColor(this.props.eurBelgium)}`}
          ></span>
        </td>
        <td className="ons-table__cell">
          <span
            data-testid="uptimecheck-asia"
            className={`ons-status ons-status--${this.getStatusColor(this.props.apacSingapore)}`}
          ></span>
        </td>
        <td className="ons-table__cell">
          <span
            data-testid="uptimecheck-northAmerica"
            className={`ons-status ons-status--${this.getStatusColor(this.props.northAmerica)}`}
          ></span>
        </td>
        <td className="ons-table__cell">
          <span
            data-testid="uptimecheck-southAmerica"
            className={`ons-status ons-status--${this.getStatusColor(this.props.southAmerica)}`}
          ></span>
        </td>
      </tr>
    );
  }
}
