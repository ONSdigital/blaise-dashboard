"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleMonitoringApi = void 0;
const monitoring_1 = require("@google-cloud/monitoring");
class GoogleMonitoringApi {
    projectId;
    uptimeClient;
    metricsClient;
    constructor(projectId) {
        this.projectId = projectId;
        this.uptimeClient = new monitoring_1.UptimeCheckServiceClient();
        this.metricsClient = new monitoring_1.MetricServiceClient();
    }
    async getUptimeChecksConfigs() {
        try {
            const request = {
                parent: this.uptimeClient.projectPath(this.projectId)
            };
            // Retrieves an uptime check config with hostnames-services like dqs, bus, bum, dashboard, etc.
            const [uptimeCheckConfigs] = await this.uptimeClient.listUptimeCheckConfigs(request);
            return uptimeCheckConfigs;
        }
        catch (error) {
            console.error(`Error in getUptimeChecksConfigs: ${error}`);
            throw error;
        }
    }
    async listTimeSeries(filter, startTime, endTime) {
        const request = {
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
exports.GoogleMonitoringApi = GoogleMonitoringApi;
