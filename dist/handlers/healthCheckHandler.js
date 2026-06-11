"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HealthCheckHandler;
exports.healthCheck = healthCheck;
const express_1 = __importDefault(require("express"));
function HealthCheckHandler() {
    const router = express_1.default.Router();
    return router.get("/dashboard-ui/:version/health", healthCheck);
}
async function healthCheck(req, res) {
    return res.status(200).json({ healthy: true });
}
//# sourceMappingURL=healthCheckHandler.js.map