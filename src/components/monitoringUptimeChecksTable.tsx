import React, { Component, ReactElement } from "react";
import { Panel, Table } from "blaise-design-system-react-components";
import { MonitoringDataModel } from "../types/monitoringDataModel";
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
            return (<Panel status="error"> Failed uptime checks data fetch....</Panel>);
        }
    }

    getRegionStatus(obj: MonitoringDataModel, regionCode: string): string {
        return obj.regions.find((region) => region.region === regionCode)?.status ?? "requestFailed";
    }

    render(): ReactElement {
        const uptimeChecksRows: ReactElement[] = this.props.monitoringData.map((obj) => ( 
            <MonitoringUptimeChecks
                key={obj.hostname}
                hostname={obj.hostname}
                eurBelgium={this.getRegionStatus(obj, "europe")}
                apacSingapore={this.getRegionStatus(obj, "apac-singapore")}
                northAmerica={this.getRegionStatus(obj, "usa-oregon")}
                southAmerica={this.getRegionStatus(obj, "sa-brazil-sao_paulo")}
            />
        ));

        return (<>
            {this.errorPanel()}
            <Table columns={["Service", "Eur-Belgium","Asia Pacific","North America", "South America"]} id="healthCheck-table">
                <>{uptimeChecksRows}</>
            </Table>
        </>);
    }
}
