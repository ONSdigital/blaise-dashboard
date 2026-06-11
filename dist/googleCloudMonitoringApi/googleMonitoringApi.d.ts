import { GetUptimeChecksConfigResult, GoogleMonitoring, ListTimeSeriesResult } from "./monitoring";
export declare class GoogleMonitoringApi implements GoogleMonitoring {
    readonly projectId: string;
    private uptimeClient;
    private metricsClient;
    constructor(projectId: string);
    getUptimeChecksConfigs(): Promise<GetUptimeChecksConfigResult>;
    listTimeSeries(filter: string, startTime: number, endTime: number): Promise<ListTimeSeriesResult>;
}
//# sourceMappingURL=googleMonitoringApi.d.ts.map