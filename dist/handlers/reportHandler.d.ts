import { BlaiseApiClient } from "blaise-api-node-client";
import { Config } from "../config";
import { Request, Response, Router } from "express";
import NodeCache from "node-cache";
export default function caseReportHandler(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config): Router;
export declare class CaseReportHandler {
    blaiseApiClient: BlaiseApiClient;
    cache: NodeCache;
    config: Config;
    constructor(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config);
    GetCaseReport(req: Request<{
        questionnaireName: string;
    }>, res: Response): Promise<Response>;
}
//# sourceMappingURL=reportHandler.d.ts.map