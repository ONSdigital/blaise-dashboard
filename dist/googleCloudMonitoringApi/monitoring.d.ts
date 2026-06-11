import { MonitoringDataModel } from "../monitoringDataModel";
import * as protos from "@google-cloud/monitoring/build/protos/protos";
export type GetUptimeChecksConfigResult = protos.google.monitoring.v3.IUptimeCheckConfig[];
export type ListTimeSeriesResult = protos.google.monitoring.v3.ITimeSeries[];
export interface GoogleMonitoring {
    getUptimeChecksConfigs(): Promise<GetUptimeChecksConfigResult>;
    listTimeSeries(filter: string, startTime: number, endTime: number): Promise<ListTimeSeriesResult>;
}
export declare function getMonitoringUptimeCheckTimeSeries(googleMonitoring: GoogleMonitoring): Promise<MonitoringDataModel[]>;
//# sourceMappingURL=monitoring.d.ts.map