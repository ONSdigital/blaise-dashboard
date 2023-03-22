import React, { Component, ReactElement } from "react";
import { ONSLoadingPanel, ONSPanel, ONSTable } from "blaise-design-system-react-components";
import { refreshInterval } from "../client/refreshInterval";
import { MonitoringDataModel, UptimeCheck } from "../server/monitoringDataModel";
import MonitoringUptimeChecks from "./monitoringUptimeChecks";

type MonitoringUptimeChecksTableProps = {
    monitoringData: MonitoringDataModel[]
}

type MonitoringUptimeChecksTableState = {
    loaded: boolean,
    uptimeChecks: UptimeCheck[]
}

export default class MonitoringUptimeChecksTable extends Component<MonitoringUptimeChecksTableProps, MonitoringUptimeChecksTableState> {
    interval!: ReturnType<typeof setInterval>;

    constructor(props: MonitoringUptimeChecksTableProps) {
        super(props);
        this.state = {
            loaded: false,
            uptimeChecks: []
        };
    }

    componentDidMount() {
        console.log("Getting monitoring data from google monitoring library");
    
        this.interval = setInterval(() => {
        }, refreshInterval);
        console.log("Got data for mount");
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    errorPanel(): ReactElement | undefined {
        if (this.state.loaded === false) {
            return undefined;
        }
        return (
            <ONSPanel status="error">
                Failed uptime checks data fetch....
            </ONSPanel>
        );
    }

    render(): ReactElement {
         const uptimeChecksRows: ReactElement[] = [];
        {this.props.monitoringData.map((obj, i) => {                  
            // Return the element. Also pass key     
            uptimeChecksRows.push(<MonitoringUptimeChecks
                        key={obj.hostname}
                        hostname={obj.hostname}
                        eurBelgium={obj.regions[0].status}
                        apacSingapore={obj.regions[1].status} usaOregon={obj.regions[2].status} usaVirginia={obj.regions[3].status}/>);
         });}
        return (<>
            {this.errorPanel()}
            <ONSTable columns={["Service", "Eur-Belgium","Asia Pacific","North America", "South America"]} tableID="case-report-table">
                <>{uptimeChecksRows}</>
            </ONSTable>
        </>);
    }
}
