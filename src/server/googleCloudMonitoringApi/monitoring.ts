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

export async function getMonitoringUptimeCheckTimeSeries(googleMonitoring: GoogleMonitoring): Promise<MonitoringDataModel[]> {
    
    const nowInSeconds = Date.now() / 1000;
    // Limit results to the last 30 seconds
    const startTime = nowInSeconds - 30; 
    const endTime = nowInSeconds;

    try {
        const uptimeCheckConfigs = await googleMonitoring.getUptimeChecksConfigs();
        const monitoringDataResponse = uptimeCheckConfigs.map(fetchHostnames);
        return Promise.all(monitoringDataResponse);
    } catch (error: unknown) {
        console.error(`Response: ${error}`);
        return [{"hostname": "unknown", "regions": [{"region": "unknown", "status": "false"}]}];
    }

    async function fetchHostnames(uptimeCheckConfig: google.monitoring.v3.IUptimeCheckConfig): Promise<MonitoringDataModel> {
    const hostname = uptimeCheckConfig.monitoredResource?.labels?.host;

    if (hostname === undefined) {
        throw new Error("Hostname is undefined");
    }

    const regions = regionsMonitored.map((region) => fetchTimeSeriesPoints(region, hostname));
    return {
        hostname: hostname,
        regions: await Promise.all(regions)
    };


        async function fetchTimeSeriesPoints(regionMonitored: string, hostname: string): Promise<Region> {
            const filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" resource.type=\"uptime_url\" " +
                `resource.label."host"="${hostname}" metric.label."checker_location"="${regionMonitored}"`;
            const status = await listTimeSeries(filter);
    
            return {
                region: regionMonitored,
                status: status
            };
        }
    
        async function listTimeSeries(filter: string): Promise<string> {
            try {
                const timeSeries = await googleMonitoring.listTimeSeries(filter, startTime, endTime);
                return timeSeries[0].points?.at(0)?.value?.boolValue == true ? "success" : "error";
            } catch (error: unknown) {
                console.log("Failed to get timeSeries points data");
                return "requestFailed";
            }
        }
    }
}