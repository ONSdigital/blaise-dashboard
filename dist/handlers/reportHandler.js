"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseReportHandler = void 0;
exports.default = caseReportHandler;
const caseCompletionReport_1 = require("../blaiseApi/caseCompletionReport");
const express_1 = __importDefault(require("express"));
function caseReportHandler(blaiseApiClient, cache, config) {
    const router = express_1.default.Router();
    const caseReportHandler = new CaseReportHandler(blaiseApiClient, cache, config);
    return router.get("/api/reports/cases/completions/:questionnaireName", caseReportHandler.GetCaseReport);
}
class CaseReportHandler {
    blaiseApiClient;
    cache;
    config;
    constructor(blaiseApiClient, cache, config) {
        this.blaiseApiClient = blaiseApiClient;
        this.cache = cache;
        this.config = config;
        this.GetCaseReport = this.GetCaseReport.bind(this);
    }
    async GetCaseReport(req, res) {
        try {
            const cacheKey = `caseStatus:${req.params.questionnaireName}`;
            let caseCompletionReport = this.cache.get(cacheKey);
            if (caseCompletionReport == undefined) {
                const caseStatusList = await this.blaiseApiClient.getCaseStatus(this.config.ServerPark, req.params.questionnaireName);
                caseCompletionReport = (0, caseCompletionReport_1.buildCaseCompletionReport)(caseStatusList);
                this.cache.set(cacheKey, caseCompletionReport);
            }
            return res.status(200).json(caseCompletionReport);
        }
        catch (error) {
            console.error(`Response: ${error}`);
            return res.status(500).json(`Failed to get case report for questionnaire ${req.params.questionnaireName}`);
        }
    }
}
exports.CaseReportHandler = CaseReportHandler;
