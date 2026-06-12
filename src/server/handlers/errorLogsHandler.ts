import express, { Request, Response, Router } from "express";
import {
  CawiLoginCount,
  ErrorLogScope,
  GcpErrorLog,
  GoogleErrorLogging,
  GoogleLoggingApi,
} from "../googleCloudLoggingApi/googleLoggingApi.js";
import logger from "../logger.js";

const loggingConfigErrorMessage = "Logging service is not configured";
const errorLogsFetchErrorMessage = "Unable to get error logs";
const cawiCountsFetchErrorMessage =
  "Unable to get CAWI successful login counts";

function getProjectIdFromEnv(): string | undefined {
  return (
    process.env.PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT
  );
}

export default function errorLogsHandler(): Router {
  const router = express.Router();
  const projectId = getProjectIdFromEnv();

  if (!projectId) {
    logger.error("Logging project ID is not configured");
    router.get("/api/logs/errors", (_req: Request, res: Response) => {
      return res.status(500).json(loggingConfigErrorMessage);
    });
    router.get(
      "/api/logs/cawi-logins/success-counts",
      (_req: Request, res: Response) => {
        return res.status(500).json(loggingConfigErrorMessage);
      },
    );
    return router;
  }

  const loggingApi = new GoogleLoggingApi(projectId);
  const handler = new ErrorLogsHandler(loggingApi);
  router.get("/api/logs/errors", handler.getErrorLogs);
  router.get(
    "/api/logs/cawi-logins/success-counts",
    handler.getCawiLoginSuccessCounts,
  );
  return router;
}

export class ErrorLogsHandler {
  private readonly loggingApi: GoogleErrorLogging;

  constructor(loggingApi: GoogleErrorLogging) {
    this.getErrorLogs = this.getErrorLogs.bind(this);
    this.getCawiLoginSuccessCounts = this.getCawiLoginSuccessCounts.bind(this);
    this.loggingApi = loggingApi;
  }

  private getScope(scopeQuery: unknown): ErrorLogScope {
    if (scopeQuery === "blaise") {
      return "blaise";
    }

    if (scopeQuery === "bts") {
      return "bts";
    }

    if (scopeQuery === "restapi") {
      return "restapi";
    }

    if (scopeQuery === "nisra") {
      return "nisra";
    }

    return "non-blaise";
  }

  async getErrorLogs(req: Request, res: Response): Promise<Response> {
    const scope = this.getScope(req.query.scope);

    try {
      const logs: GcpErrorLog[] =
        await this.loggingApi.getErrorLogsLast24Hours(scope);
      return res.status(200).json(logs);
    } catch (error: unknown) {
      logger.error({ scope, error }, "Failed to get GCP error logs");
      return res.status(500).json(errorLogsFetchErrorMessage);
    }
  }

  async getCawiLoginSuccessCounts(
    _req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const counts: CawiLoginCount[] =
        await this.loggingApi.getCawiSuccessfulLoginCountsLast24Hours();
      return res.status(200).json(counts);
    } catch (error: unknown) {
      logger.error({ error }, "Failed to get CAWI successful login counts");
      return res.status(500).json(cawiCountsFetchErrorMessage);
    }
  }
}
