"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringHandler = void 0;
exports.default = NewMonitoringListHandler;
const express_1 = __importDefault(require("express"));
const googleMonitoringApi_1 = require("../googleCloudMonitoringApi/googleMonitoringApi");
const monitoring_1 = require("../googleCloudMonitoringApi/monitoring");
function getProjectIdFromEnv() {
    return process.env.PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
}
function NewMonitoringListHandler() {
    const router = express_1.default.Router();
    const projectId = getProjectIdFromEnv();
    if (!projectId) {
        console.error("Monitoring project ID is not configured");
        return router.get("/api/monitoring", (_req, res) => {
            return res.status(500).json("Monitoring project ID is not configured");
        });
    }
    const googleMonitoringApi = new googleMonitoringApi_1.GoogleMonitoringApi(projectId);
    const monitoringHandler = new MonitoringHandler(googleMonitoringApi);
    return router.get("/api/monitoring", monitoringHandler.GetMonitoringData);
}
class MonitoringHandler {
    googleMonitoring;
    constructor(googleMonitoring) {
        this.GetMonitoringData = this.GetMonitoringData.bind(this);
        this.googleMonitoring = googleMonitoring;
    }
    async GetMonitoringData(req, res) {
        try {
            return res.status(200).json(await (0, monitoring_1.getMonitoringUptimeCheckTimeSeries)(this.googleMonitoring));
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            console.error(`Response: ${reason}`);
            return res.status(500).json(`Failed to get monitoring uptimeChecks config data: ${reason}`);
        }
    }
}
exports.MonitoringHandler = MonitoringHandler;
//# sourceMappingURL=monitoringHandler.js.map