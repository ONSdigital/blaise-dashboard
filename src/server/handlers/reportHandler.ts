import BlaiseApiClient from "blaise-api-node-client";
import {Config} from "../config";
import {buildCaseCompletionReport} from "../blaiseApi/caseCompletionReport";
import express, {Request, Response, Router} from "express";

export default function caseReportHandler(blaiseApiClient: BlaiseApiClient, config: Config): Router {
    const router = express.Router();

    const caseReportHandler = new CaseReportHandler(blaiseApiClient, config);
    return router.get("/api/reports/cases/completions/:instrumentName", caseReportHandler.GetCaseReport);
}

export class CaseReportHandler {
    blaiseApiClient: BlaiseApiClient;
    config: Config;

    constructor(blaiseApiClient: BlaiseApiClient, config: Config) {
        this.blaiseApiClient = blaiseApiClient;
        this.config = config;
        this.GetCaseReport = this.GetCaseReport.bind(this);
    }

    async GetCaseReport(req: Request, res: Response): Promise<Response> {
        try {
            let caseStatusList = await this.blaiseApiClient.getCaseStatus(this.config.ServerPark, req.params.instrumentName);

            let caseCompletionReport = buildCaseCompletionReport(caseStatusList);

            return res.status(200).json(caseCompletionReport);
        } catch (error: any) {
            console.error(`Response: ${error}`);
            return res.status(500).json(`Failed to get case report for instrument ${req.params.instrumentName}`);
        }
    }
}