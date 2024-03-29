import React, {Component, ReactElement} from "react";

type MonitoringUptimeChecksProps = {
    hostname: string,
    eurBelgium : string,
    apacSingapore : string,
    northAmerica : string,
    southAmerica : string
}

export default class MonitoringUptimeChecks extends Component<MonitoringUptimeChecksProps> {
    constructor(props: MonitoringUptimeChecksProps) {
        super(props);
    }

    getStatusColor(status: string  | undefined) {
        switch (status) {
        case "success":
            return "success";
        case "error":
            return "error";    
        default:
            return "requestFailed";
        }
    }

    render(): ReactElement {

        // | hostname | Europe | Asia Pacific   | North America  |  South America  |
        // | dev-sj01-bts.social-surveys.gcp.onsdigital.uk      | true    | true | true |  true |

        return (
            <tr className="ons-table__row" key={this.props.hostname} data-testid="monitoring-table-row">
                <td className="ons-table__cell" data-testid={`uptimecheck-${this.props.hostname}`}>
                    {this.props.hostname}
                </td>
                <td className="ons-table__cell">
                    <span data-testid="uptimecheck-europe"
                        className={`ons-status ons-status--${this.getStatusColor(this.props.eurBelgium)}`}>
                    </span>
                </td>
                <td className="ons-table__cell">
                    <span data-testid="uptimecheck-asia"
                        className={`ons-status ons-status--${this.getStatusColor(this.props.apacSingapore)}`}>
                    </span>
                </td>
                <td className="ons-table__cell">
                    <span data-testid="uptimecheck-northAmerica"
                        className={`ons-status ons-status--${this.getStatusColor(this.props.northAmerica)}`}>
                    </span>
                </td>
                <td className="ons-table__cell">
                    <span data-testid="uptimecheck-southAmerica"
                        className={`ons-status ons-status--${this.getStatusColor(this.props.southAmerica)}`}>
                    </span>
                </td>
            </tr>
        );
    }
}
