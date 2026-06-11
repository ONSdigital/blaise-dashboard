"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlaiseStatusHandler;
exports.getBlaiseStatus = getBlaiseStatus;
const express_1 = __importDefault(require("express"));
function BlaiseStatusHandler(blaiseApiClient) {
    const router = express_1.default.Router();
    return router.get("/api/health", (req, res) => getBlaiseStatus(req, res, blaiseApiClient));
}
function mapDiagnosticsToDqsStatus(diagnostics) {
    return diagnostics.map((diagnostic) => ({
        "health check type": diagnostic.healthCheckType,
        status: diagnostic.status
    }));
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
