import { Request, Response, Router } from "express";
import { GoogleErrorLogging } from "../googleCloudLoggingApi/googleLoggingApi";
export default function errorLogsHandler(): Router;
export declare class ErrorLogsHandler {
    private readonly loggingApi;
    constructor(loggingApi: GoogleErrorLogging);
    private getScope;
    GetErrorLogs(req: Request, res: Response): Promise<Response>;
    GetCawiLoginSuccessCounts(_req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=errorLogsHandler.d.ts.map