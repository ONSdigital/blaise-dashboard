import {
  MetricServiceClient,
  UptimeCheckServiceClient,
} from "@google-cloud/monitoring";
import {
  GetUptimeChecksConfigResult,
  GoogleMonitoring,
  ListTimeSeriesResult,
} from "./monitoring.js";
import logger from "../logger.js";

export class GoogleMonitoringApi implements GoogleMonitoring {
  private uptimeClient: UptimeCheckServiceClient;
  private metricsClient: MetricServiceClient;

  constructor(public readonly projectId: string) {
    this.uptimeClient = new UptimeCheckServiceClient();
    this.metricsClient = new MetricServiceClient();
  }

  async getUptimeChecksConfigs(): Promise<GetUptimeChecksConfigResult> {
    try {
      const request = {
        parent: this.uptimeClient.projectPath(this.projectId),
      };

      const [uptimeCheckConfigs] =
        await this.uptimeClient.listUptimeCheckConfigs(request);
      return uptimeCheckConfigs;
    } catch (error) {
      logger.error({ error }, "Failed to get uptime check configs");
      throw error;
    }
  }
  async listTimeSeries(
    filter: string,
    startTime: number,
    endTime: number,
  ): Promise<ListTimeSeriesResult> {
    const request = {
      name: this.metricsClient.projectPath(this.projectId),
      filter: filter,
      interval: {
        startTime: {
          seconds: startTime,
        },
        endTime: {
          seconds: endTime,
        },
      },
    };
    const [timeSeries] = await this.metricsClient.listTimeSeries(request);
    return timeSeries;
  }
}
