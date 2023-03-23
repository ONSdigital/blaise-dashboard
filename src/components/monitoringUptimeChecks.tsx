import React, {Component, ReactElement} from "react";
import {ONSLoadingPanel} from "blaise-design-system-react-components";

type MonitoringUptimeChecksProps = {
    hostname: string,
    eurBelgium : string,
    apacSingapore : string,
    northAmerica : string,
    southAmerica : string
}

type MonitoringUptimeChecksState = {
    loaded: boolean
}

export default class MonitoringUptimeChecks extends Component<MonitoringUptimeChecksProps, MonitoringUptimeChecksState> {
    constructor(props: MonitoringUptimeChecksProps) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        this.setState({
            loaded: true
        });
    }

    getStatusColor(status: string  | undefined) {
        switch (status) {
        case "success":
            return "success";
        case "error":
            return "error";    
        default:
            return "info";
        }
    }


    render(): ReactElement {
        if (!this.state.loaded) {
            return <tr><td><ONSLoadingPanel message={"Getting uptime checks"}/></td></tr>;
        }

        // | hostname | Europe | Asia Pacific   | North America  |  South America  |
        // | dev-sj01-bts.social-surveys.gcp.onsdigital.uk      | true    | true | true |  true |

        return (
            <tr className="ons-table__row" key={this.props.hostname} data-testid={"questionnaire-table-row"}>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-questionnaire-${this.props.hostname}`}>
                    {this.props.hostname}
                </td>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-total-${this.props.hostname}`}>
                    <span
                className={`ons-status ons-status--${this.getStatusColor(this.props.eurBelgium)}`}>
            </span>
                </td>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-complete-${this.props.hostname}`}>
                <span
                className={`ons-status ons-status--${this.getStatusColor(this.props.apacSingapore)}`}>
            </span>
                </td>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-complete-${this.props.hostname}`}>
                <span
                className={`ons-status ons-status--${this.getStatusColor(this.props.northAmerica)}`}>
            </span>
                </td>
                <td className="ons-table__cell" data-testid={`questionnaire-case-report-complete-${this.props.hostname}`}>
                <span
                className={`ons-status ons-status--${this.getStatusColor(this.props.southAmerica)}`}>
            </span>
                </td>
                
            </tr>
        );
    }
}
