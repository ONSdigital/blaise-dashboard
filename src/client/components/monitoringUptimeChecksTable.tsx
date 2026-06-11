import { Component, ReactElement } from "react";
import { Table } from "blaise-design-system-react-components";
import { MonitoringDataModel } from "../types/monitoringDataModel";
import MonitoringUptimeChecks from "./monitoringUptimeChecks";

type MonitoringUptimeChecksTableProps = {
  monitoringData: MonitoringDataModel[];
};

export default class MonitoringUptimeChecksTable extends Component<MonitoringUptimeChecksTableProps> {
  getRegionStatus(obj: MonitoringDataModel, regionCodes: string[]): string {
    const status = obj.regions.find((region) =>
      regionCodes.includes(region.region),
    )?.status;
    return status ?? "requestFailed";
  }

  render(): ReactElement {
    const uptimeChecksRows: ReactElement[] = this.props.monitoringData.map(
      (obj) => (
        <MonitoringUptimeChecks
          key={obj.hostname}
          hostname={obj.hostname}
          eurBelgium={this.getRegionStatus(obj, ["eur-belgium", "europe"])}
          apacSingapore={this.getRegionStatus(obj, ["apac-singapore"])}
          northAmerica={this.getRegionStatus(obj, [
            "usa-oregon",
            "usa-iowa",
            "usa-virginia",
          ])}
          southAmerica={this.getRegionStatus(obj, ["sa-brazil-sao_paulo"])}
        />
      ),
    );

    return (
      <>
        <Table
          columns={[
            "Service",
            "Eur-Belgium",
            "Asia Pacific",
            "North America",
            "South America",
          ]}
          id="healthCheck-table"
        >
          <>{uptimeChecksRows}</>
        </Table>
      </>
    );
  }
}
