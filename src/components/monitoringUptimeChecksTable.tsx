import React, { Component, ReactElement } from "react";
import { ONSPanel, ONSTable } from "blaise-design-system-react-components";
import { MonitoringDataModel, UptimeCheck } from "../server/monitoringDataModel";
import MonitoringUptimeChecks from "./monitoringUptimeChecks";

type MonitoringUptimeChecksTableProps = {
    monitoringData: MonitoringDataModel[]
}

export default class MonitoringUptimeChecksTable extends Component<MonitoringUptimeChecksTableProps> {

    constructor(props: MonitoringUptimeChecksTableProps) {
        super(props);
        
    }

    errorPanel(): ReactElement | undefined {
        if (this.props.monitoringData.length === 0) {
            return (<ONSPanel status="error"> Failed uptime checks data fetch....</ONSPanel>);
        }
    }

    render(): ReactElement {
        const uptimeChecksRows: ReactElement[] = this.props.monitoringData.map((obj) => ( 
            <MonitoringUptimeChecks
                key={obj.hostname}
                hostname={obj.hostname}
                eurBelgium={obj.regions[0].status}
                apacSingapore={obj.regions[1].status}
                northAmerica={obj.regions[2].status}
                southAmerica={obj.regions[3].status}
            />
        ));

        return (<>
            {this.errorPanel()}
            <ONSTable columns={["Service", "Eur-Belgium","Asia Pacific","North America", "South America"]} tableID="healthCheck-table">
                <>{uptimeChecksRows}</>
            </ONSTable>
        </>);
    }
}
