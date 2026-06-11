"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonitoringUptimeCheckTimeSeries = getMonitoringUptimeCheckTimeSeries;
const regionsMonitored = ["eur-belgium", "apac-singapore", "usa-oregon", "sa-brazil-sao_paulo"];
async function getMonitoringUptimeCheckTimeSeries(googleMonitoring) {
    const nowInSeconds = Date.now() / 1000;
    // Limit results to the last 30 seconds
    const startTime = nowInSeconds - 30;
    const endTime = nowInSeconds;
    try {
        const uptimeCheckConfigs = await googleMonitoring.getUptimeChecksConfigs();
        const hostnames = uptimeCheckConfigs
            .map((uptimeCheckConfig) => uptimeCheckConfig.monitoredResource?.labels?.host)
            .filter((hostname) => typeof hostname === "string" && hostname.length > 0);
        const monitoringDataResponse = hostnames.map(fetchHostname);
        return await Promise.all(monitoringDataResponse);
    }
    catch (error) {
        console.error(`Response: ${error}`);
        throw error;
    }
    async function fetchHostname(hostname) {
        const regions = regionsMonitored.map((region) => fetchTimeSeriesPoints(region, hostname));
        return {
            hostname: hostname,
            regions: await Promise.all(regions)
        };
    }
    async function fetchTimeSeriesPoints(regionMonitored, hostname) {
        const filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" resource.type=\"uptime_url\" " +
            `resource.label."host"="${hostname}" metric.label."checker_location"="${regionMonitored}"`;
        const status = await listTimeSeries(filter);
        return {
            region: regionMonitored,
            status: status
        };
    }
    async function listTimeSeries(filter) {
        try {
            const timeSeries = await googleMonitoring.listTimeSeries(filter, startTime, endTime);
            return timeSeries[0].points?.at(0)?.value?.boolValue == true ? "success" : "error";
        }
        catch {
            console.log("Failed to get timeSeries points data");
            return "requestFailed";
        }
    }
}
