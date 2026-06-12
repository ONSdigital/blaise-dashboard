import { BlaiseApiClient } from "blaise-api-node-client";
import { Config } from "../config.js";
import {
  buildCaseCompletionReport,
  CaseCompletionReport,
} from "../blaiseApi/caseCompletionReport.js";
import express, { Request, Response, Router } from "express";
import NodeCache from "node-cache";
import logger from "../logger.js";

export default function caseReportHandler(
  blaiseApiClient: BlaiseApiClient,
  cache: NodeCache,
  config: Config,
): Router {
  const router = express.Router();

  const caseReportRouteHandler = new CaseReportHandler(
    blaiseApiClient,
    cache,
    config,
  );
  return router.get(
    "/api/reports/cases/completions/:questionnaireName",
    caseReportRouteHandler.getCaseReport,
  );
}

class CaseReportHandler {
  blaiseApiClient: BlaiseApiClient;
  cache: NodeCache;
  config: Config;

  constructor(
    blaiseApiClient: BlaiseApiClient,
    cache: NodeCache,
    config: Config,
  ) {
    this.blaiseApiClient = blaiseApiClient;
    this.cache = cache;
    this.config = config;
    this.getCaseReport = this.getCaseReport.bind(this);
  }

  async getCaseReport(
    req: Request<{ questionnaireName: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      const cacheKey = `caseStatus:${req.params.questionnaireName}`;
      let caseCompletionReport: CaseCompletionReport | undefined =
        this.cache.get(cacheKey);
      if (caseCompletionReport == undefined) {
        const caseStatusList = await this.blaiseApiClient.getCaseStatus(
          this.config.ServerPark,
          req.params.questionnaireName,
        );
        caseCompletionReport = buildCaseCompletionReport(caseStatusList);
        this.cache.set(cacheKey, caseCompletionReport);
      }

      return res.status(200).json(caseCompletionReport);
    } catch (error: unknown) {
      logger.error(
        {
          questionnaireName: req.params.questionnaireName,
          error,
        },
        "Failed to get case report for questionnaire",
      );
      return res
        .status(500)
        .json(
          `Failed to get case report for questionnaire ${req.params.questionnaireName}`,
        );
    }
  }
}
