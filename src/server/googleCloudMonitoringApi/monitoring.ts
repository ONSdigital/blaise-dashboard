import {MetricServiceClient, UptimeCheckServiceClient} from "@google-cloud/monitoring";
import {MonitoringDataModel, Region} from "../monitoringDataModel";
import {google} from "@google-cloud/monitoring/build/protos/protos";
import * as protos from "@google-cloud/monitoring/build/protos/protos";

const regionsMonitored: string [] = ["eur-belgium", "apac-singapore", "usa-oregon", "sa-brazil-sao_paulo"];

export type GetUptimeChecksConfigResult = protos.google.monitoring.v3.IUptimeCheckConfig[];

export type ListTimeSeriesResult = protos.google.monitoring.v3.ITimeSeries[];

export interface GoogleMonitoring {
    getUptimeChecksConfigs(): Promise<GetUptimeChecksConfigResult>;

    listTimeSeries(filter: string, startTime: number, endTime: number): Promise<ListTimeSeriesResult>;
}

export async function getMonitoringUptimeCheckTimeSeries(
    googleMonitoring: GoogleMonitoring
): Promise<MonitoringDataModel[]> {
    const nowInSeconds = Date.now() / 1000;

    const startTime = nowInSeconds - 30;
    const endTime = nowInSeconds;

    try {
        const uptimeCheckConfigs = await googleMonitoring.getUptimeChecksConfigs();
        const monitoringDataResponse = uptimeCheckConfigs.map(fetchHostnames);
        return Promise.all(monitoringDataResponse);
    } catch (error: any) {
        console.error(`Response: ${error}`);
        return [{"hostname": "bts", "regions": [{"region": "europe", "status": "false"}]}];
    }

    async function fetchHostnames(uptimeCheckConfig: google.monitoring.v3.IUptimeCheckConfig): Promise<MonitoringDataModel> {
        const hostname = uptimeCheckConfig.monitoredResource?.labels?.host!;
        const regions = regionsMonitored.map((region) => fetchTimeSeriesPoints(region, hostname));
        return {
            hostname: hostname,
            regions: await Promise.all(regions)
        };
    }

    async function fetchTimeSeriesPoints(regionMonitored: string, hostname: string): Promise<Region> {
        const filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" resource.type=\"uptime_url\" " +
            `resource.label."host"="${hostname}" metric.label."checker_location"="${regionMonitored}"`;
        const status = await listTimeSeries(filter, hostname, regionMonitored);

        return {
            region: regionMonitored,
            status: status
        };
    }

    async function listTimeSeries(filter: string, hostname: string, regionMonitored: string): Promise<string> {
        try {
            const timeSeries = await googleMonitoring.listTimeSeries(filter, startTime, endTime);
            console.log(`Status: for ${hostname} in region = ${regionMonitored} is ${JSON.stringify(timeSeries[0].points?.at(0)?.value?.boolValue)}`);
            return timeSeries[0].points?.at(0)?.value?.boolValue == true ? "success" : "error";
        } catch (error: any) {
            console.error(`Response: ${error}`);
            console.log("Failed to get timeSeries points data");
            return "requestFailed";
        }
    }
}

//Google calling functions -- cannot be testes :)
// TODO: I would put this in a different file
export class GoogleMonitoringApi implements GoogleMonitoring {
    private uptimeClient: UptimeCheckServiceClient;
    private metricsClient: MetricServiceClient;

    constructor(public readonly projectId: string) {
        this.uptimeClient = new UptimeCheckServiceClient();
        this.metricsClient = new MetricServiceClient();
    }
    async getUptimeChecksConfigs(): Promise<GetUptimeChecksConfigResult> {

        const request = {
            parent: this.uptimeClient.projectPath(this.projectId)
        };

        // Retrieves an uptime check config with hostnames-services like dqs, bus, bum, dashboard etc
        const [uptimeCheckConfigs] = await this.uptimeClient.listUptimeCheckConfigs(request);

        return uptimeCheckConfigs;
    }

    async listTimeSeries(filter: string, startTime: number, endTime: number): Promise<ListTimeSeriesResult> {
        const request = {
            name: this.metricsClient.projectPath(this.projectId),
            filter: filter,
            interval: {
                startTime: {
                    // Limit results to the last 30 seconds
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
