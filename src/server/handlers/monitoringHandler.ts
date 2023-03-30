import express, { Request, Response, Router } from "express";
import { getMonitoringUptimeCheckTimeSeries } from "../googleCloudMonitoringApi/monitoring";

export default function NewMonitoringListHandler(): Router {
    const router = express.Router();

    const monitoringHandler = new MonitoringHandler();
    return router.get("/api/monitoring", monitoringHandler.GetMonitoringData);
}

export class MonitoringHandler {
    
    constructor() {
        this.GetMonitoringData = this.GetMonitoringData.bind(this);
    }

    async GetMonitoringData(req: Request, res: Response): Promise<Response> {
        
        try {
            return res.status(200).json(await getMonitoringUptimeCheckTimeSeries(process.env.GOOGLE_CLOUD_PROJECT || "no_project_id"));
        } catch (error: any) {
            console.error(`Response: ${error}`);
            return res.status(500).json("Failed to get monitoring uptimeChecks config data");
        }
    }
}
