"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogsHandler = void 0;
exports.default = errorLogsHandler;
const express_1 = __importDefault(require("express"));
const googleLoggingApi_1 = require("../googleCloudLoggingApi/googleLoggingApi");
function getProjectIdFromEnv() {
    return process.env.PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
}
function errorLogsHandler() {
    const router = express_1.default.Router();
    const projectId = getProjectIdFromEnv();
    if (!projectId) {
        console.error("Logging project ID is not configured");
        router.get("/api/logs/errors", (_req, res) => {
            return res.status(500).json("Logging project ID is not configured");
        });
        router.get("/api/logs/cawi-logins/success-counts", (_req, res) => {
            return res.status(500).json("Logging project ID is not configured");
        });
        return router;
    }
    const loggingApi = new googleLoggingApi_1.GoogleLoggingApi(projectId);
    const handler = new ErrorLogsHandler(loggingApi);
    router.get("/api/logs/errors", handler.GetErrorLogs);
    router.get("/api/logs/cawi-logins/success-counts", handler.GetCawiLoginSuccessCounts);
    return router;
}
class ErrorLogsHandler {
    loggingApi;
    constructor(loggingApi) {
        this.GetErrorLogs = this.GetErrorLogs.bind(this);
        this.GetCawiLoginSuccessCounts = this.GetCawiLoginSuccessCounts.bind(this);
        this.loggingApi = loggingApi;
    }
    getScope(scopeQuery) {
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
    async GetErrorLogs(req, res) {
        const scope = this.getScope(req.query.scope);
        try {
            const logs = await this.loggingApi.getErrorLogsLast24Hours(scope);
            return res.status(200).json(logs);
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            console.error(`Failed to get ${scope} GCP error logs: ${reason}`);
            return res.status(500).json(`Failed to get ${scope} GCP error logs: ${reason}`);
        }
    }
    async GetCawiLoginSuccessCounts(_req, res) {
        try {
            const counts = await this.loggingApi.getCawiSuccessfulLoginCountsLast24Hours();
            return res.status(200).json(counts);
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            console.error(`Failed to get CAWI successful login counts: ${reason}`);
            return res.status(500).json(`Failed to get CAWI successful login counts: ${reason}`);
        }
    }
}
exports.ErrorLogsHandler = ErrorLogsHandler;
//# sourceMappingURL=errorLogsHandler.js.map