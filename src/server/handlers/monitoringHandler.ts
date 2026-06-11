import express, { Request, Response, Router } from "express";
import { GoogleMonitoringApi } from "../googleCloudMonitoringApi/googleMonitoringApi.js";
import {
    getMonitoringUptimeCheckTimeSeries,
    GoogleMonitoring
} from "../googleCloudMonitoringApi/monitoring.js";

function getProjectIdFromEnv(): string | undefined {
    return process.env.PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
}

export default function NewMonitoringListHandler(): Router {
    const router = express.Router();
    const projectId = getProjectIdFromEnv();

    if (!projectId) {
        console.error("Monitoring project ID is not configured");
        return router.get("/api/monitoring", (_req: Request, res: Response) => {
            return res.status(500).json("Monitoring project ID is not configured");
        });
    }

    const googleMonitoringApi = new GoogleMonitoringApi(projectId);
    const monitoringHandler = new MonitoringHandler(googleMonitoringApi);
    return router.get("/api/monitoring", monitoringHandler.GetMonitoringData);
}

class MonitoringHandler {
    private readonly googleMonitoring: GoogleMonitoring;

    constructor(googleMonitoring: GoogleMonitoring) {
        this.GetMonitoringData = this.GetMonitoringData.bind(this);
        this.googleMonitoring = googleMonitoring;
    }

    async GetMonitoringData(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json(await getMonitoringUptimeCheckTimeSeries(this.googleMonitoring));
        } catch (error: unknown) {
            const reason = error instanceof Error ? error.message : String(error);
            console.error(`Response: ${reason}`);
            return res.status(500).json(`Failed to get monitoring uptimeChecks config data: ${reason}`);
        }
    }
}