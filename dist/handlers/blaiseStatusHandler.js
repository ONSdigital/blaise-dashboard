"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlaiseStatusHandler;
exports.getBlaiseStatus = getBlaiseStatus;
const express_1 = __importDefault(require("express"));
const defaultHealthCheckTypes = [
    "Connection model",
    "Blaise connection",
    "Remote data server connection",
    "Remote Cati management connection"
];
function BlaiseStatusHandler(blaiseApiClient) {
    const router = express_1.default.Router();
    return router.get("/api/health", (req, res) => getBlaiseStatus(req, res, blaiseApiClient));
}
function mapDiagnosticsToDqsStatus(diagnostics) {
    return diagnostics.map((diagnostic, index) => {
        const healthCheckTypeFromDiagnostic = diagnostic;
        const directHealthCheckType = healthCheckTypeFromDiagnostic["health check type"];
        const camelCaseHealthCheckType = healthCheckTypeFromDiagnostic.healthCheckType;
        const derivedHealthCheckType = Object.entries(healthCheckTypeFromDiagnostic)
            .find(([key, value]) => {
            const normalizedKey = key.replace(/[^a-z]/gi, "").toLowerCase();
            return normalizedKey.includes("healthchecktype") && typeof value === "string" && value.trim().length > 0;
        })?.[1];
        const fallbackHealthCheckType = index < defaultHealthCheckTypes.length
            ? defaultHealthCheckTypes[index]
            : "Unknown health check";
        const status = typeof diagnostic.status === "string" && diagnostic.status.trim().length > 0
            ? diagnostic.status
            : "Unknown";
        return {
            "health check type": (typeof directHealthCheckType === "string" && directHealthCheckType.trim().length > 0 && directHealthCheckType)
                || (typeof camelCaseHealthCheckType === "string" && camelCaseHealthCheckType.trim().length > 0 && camelCaseHealthCheckType)
                || (typeof derivedHealthCheckType === "string" && derivedHealthCheckType)
                || fallbackHealthCheckType,
            status
        };
    });
}
async function getBlaiseStatus(_req, res, blaiseApiClient) {
    try {
        const diagnostics = await blaiseApiClient.getDiagnostics();
        return res.status(200).json(mapDiagnosticsToDqsStatus(diagnostics));
    }
    catch (error) {
        console.error("Failed to retrieve Blaise status", error);
        return res.status(500).json({ message: "Unable to get Blaise status" });
    }
}
//# sourceMappingURL=blaiseStatusHandler.js.map