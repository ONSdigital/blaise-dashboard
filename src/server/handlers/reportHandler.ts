import BlaiseApiClient, { CaseStatus } from "blaise-api-node-client";
import { Config } from "../config";
import { buildCaseCompletionReport, CaseCompletionReport } from "../blaiseApi/caseCompletionReport";
import express, { Request, Response, Router } from "express";
import NodeCache from "node-cache";

export default function caseReportHandler(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config): Router {
    const router = express.Router();

    const caseReportHandler = new CaseReportHandler(blaiseApiClient, cache, config);
    return router.get("/api/reports/cases/completions/:questionnaireName", caseReportHandler.GetCaseReport);
}

export class CaseReportHandler {
    blaiseApiClient: BlaiseApiClient;
    cache: NodeCache;
    config: Config;

    constructor(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config) {
        this.blaiseApiClient = blaiseApiClient;
        this.cache = cache;
        this.config = config;
        this.GetCaseReport = this.GetCaseReport.bind(this);
    }

    async GetCaseReport(req: Request, res: Response): Promise<Response> {
        try {
            const cacheKey = `caseStatus:${req.params.questionnaireName}`;
            let caseCompletionReport: CaseCompletionReport | undefined = this.cache.get(cacheKey);
            if (caseCompletionReport == undefined) {
                const caseStatusList = await this.blaiseApiClient.getCaseStatus(this.config.ServerPark, req.params.questionnaireName);
                caseCompletionReport = buildCaseCompletionReport(caseStatusList);
                this.cache.set(cacheKey, caseCompletionReport);
            }

            return res.status(200).json(caseCompletionReport);
        } catch (error: unknown) {
            console.error(`Response: ${error}`);
            return res.status(500).json(`Failed to get case report for questionnaire ${req.params.questionnaireName}`);
        }
    }
}
