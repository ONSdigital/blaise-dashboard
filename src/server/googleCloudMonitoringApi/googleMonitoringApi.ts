import { MetricServiceClient, UptimeCheckServiceClient } from "@google-cloud/monitoring";
import { GetUptimeChecksConfigResult, GoogleMonitoring, ListTimeSeriesResult } from "./monitoring";

export class GoogleMonitoringApi implements GoogleMonitoring {
    private uptimeClient: UptimeCheckServiceClient;
    private metricsClient: MetricServiceClient;

    constructor(public readonly projectId: string){
        this.uptimeClient = new UptimeCheckServiceClient();
        this.metricsClient = new MetricServiceClient();
    }

    async getUptimeChecksConfigs(): Promise<GetUptimeChecksConfigResult> {
    try {
        const request = {
            parent: this.uptimeClient.projectPath(this.projectId)
        };

        // Retrieves an uptime check config with hostnames-services like dqs, bus, bum, dashboard, etc.
        const [uptimeCheckConfigs] = await this.uptimeClient.listUptimeCheckConfigs(request);
        return uptimeCheckConfigs;
    } catch (error) {
        console.error(`Error in getUptimeChecksConfigs: ${error}`);
        throw error;
    }
}
    async listTimeSeries(filter: string, startTime: number, endTime: number): Promise<ListTimeSeriesResult>{
        const request= {
            name: this.metricsClient.projectPath(this.projectId),
            filter: filter,
            interval: {
                startTime: {
                    seconds: startTime,
                },
                endTime: {
                    seconds: endTime
                }
            }

        };
        // Writes time series data
        const [timeSeries] = await this.metricsClient.listTimeSeries(request);
        return timeSeries;
    }
}