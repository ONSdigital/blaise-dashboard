import express, { Request, Response, Router } from "express";
import { GoogleMonitoringApi } from "../googleCloudMonitoringApi/googleMonitoringApi";
import {
    getMonitoringUptimeCheckTimeSeries,
    GoogleMonitoring
} from "../googleCloudMonitoringApi/monitoring";

export default function NewMonitoringListHandler(): Router {
    const router = express.Router();
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || "no_project_id";
    const googleMonitoringApi = new GoogleMonitoringApi(projectId);
    const monitoringHandler = new MonitoringHandler(googleMonitoringApi);
    return router.get("/api/monitoring", monitoringHandler.GetMonitoringData);
}

export class MonitoringHandler {
    private readonly googleMonitoring: GoogleMonitoring;

    constructor(googleMonitoring: GoogleMonitoring) {
        this.GetMonitoringData = this.GetMonitoringData.bind(this);
        this.googleMonitoring = googleMonitoring;
    }

    async GetMonitoringData(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json(await getMonitoringUptimeCheckTimeSeries(this.googleMonitoring));
        } catch (error: unknown) {
            console.error(`Response: ${error}`);
            return res.status(500).json("Failed to get monitoring uptimeChecks config data");
        }
    }
}