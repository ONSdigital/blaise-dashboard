import express, { Request, Response, Router } from "express";
import { getMonitoringUptimeCheckTimeSeries } from "../googleCloudMonitoringApi/monitoring";

export default function NewMonitoringListHandler(): Router {
    const router = express.Router();

    const monitoringHandler = new MonitoringHandler();
    return router.get("/api/monitoring", monitoringHandler.GetMonitoringData);
}
 
const regionsMonitored : string [] = ["eur-belgium", "apac-singapore", "usa-oregon","sa-brazil-sao_paulo"];
const projectId = "ons-blaise-v2-dev-sj01";

export class MonitoringHandler {
    
    constructor() {
        this.GetMonitoringData = this.GetMonitoringData.bind(this);
    }

    async GetMonitoringData(req: Request, res: Response): Promise<Response> {
        
        try {
            return res.status(200).json(await getMonitoringUptimeCheckTimeSeries(projectId,regionsMonitored));
        } catch (error: any) {
            console.error(`Response: ${error}`);
            return res.status(500).json("Failed to get monitoring uptimeChecks config data");
        }
    }
}
