import { Request, Response, Router } from "express";
import { GoogleMonitoring } from "../googleCloudMonitoringApi/monitoring";
export default function NewMonitoringListHandler(): Router;
export declare class MonitoringHandler {
    private readonly googleMonitoring;
    constructor(googleMonitoring: GoogleMonitoring);
    GetMonitoringData(req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=monitoringHandler.d.ts.map