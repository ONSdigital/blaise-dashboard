import {MonitoringDataModel, Region} from "../monitoringDataModel.js";
import * as protos from "@google-cloud/monitoring/build/protos/protos.js";

const regionsMonitored: string [] = ["eur-belgium", "apac-singapore", "usa-oregon", "sa-brazil-sao_paulo"];
const LOOKBACK_SECONDS = 10 * 60;

export type GetUptimeChecksConfigResult = protos.google.monitoring.v3.IUptimeCheckConfig[];
export type ListTimeSeriesResult = protos.google.monitoring.v3.ITimeSeries[];

export interface GoogleMonitoring {
    getUptimeChecksConfigs(): Promise<GetUptimeChecksConfigResult>;
    listTimeSeries(filter: string, startTime: number, endTime: number): Promise<ListTimeSeriesResult>;
}

export async function getMonitoringUptimeCheckTimeSeries(googleMonitoring: GoogleMonitoring): Promise<MonitoringDataModel[]> {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    // Uptime checks can run every few minutes, so query a wider interval.
    const startTime = nowInSeconds - LOOKBACK_SECONDS;
    const endTime = nowInSeconds;

    try {
        const uptimeCheckConfigs = await googleMonitoring.getUptimeChecksConfigs();
        const hostnames = uptimeCheckConfigs
            .map((uptimeCheckConfig) => uptimeCheckConfig.monitoredResource?.labels?.host)
            .filter((hostname): hostname is string => typeof hostname === "string" && hostname.length > 0);

        const monitoringDataResponse = hostnames.map(fetchHostname);
        return await Promise.all(monitoringDataResponse);
    } catch (error: unknown) {
        console.error(`Response: ${error}`);
        throw error;
    }

    async function fetchHostname(hostname: string): Promise<MonitoringDataModel> {
        const regions = regionsMonitored.map((region) => fetchTimeSeriesPoints(region, hostname));
        return {
            hostname: hostname,
            regions: await Promise.all(regions)
        };
    }


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
                const points = timeSeries.flatMap((series) => series.points ?? []);
                if (points.length === 0) {
                    return "requestFailed";
                }

                const latestPoint = points.at(-1);
                const value = latestPoint?.value;

                if (typeof value?.boolValue === "boolean") {
                    return value.boolValue ? "success" : "error";
                }

                if (typeof value?.doubleValue === "number") {
                    return value.doubleValue >= 1 ? "success" : "error";
                }

                if (value?.int64Value !== undefined && value.int64Value !== null) {
                    return Number(value.int64Value) >= 1 ? "success" : "error";
                }

                return "requestFailed";
            } catch {
                console.log("Failed to get timeSeries points data");
                return "requestFailed";
            }
        }
}