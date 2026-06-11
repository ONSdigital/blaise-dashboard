"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const healthCheckHandler_1 = __importDefault(require("./handlers/healthCheckHandler"));
const questionnaireListHandler_1 = __importDefault(require("./handlers/questionnaireListHandler"));
const reportHandler_1 = __importDefault(require("./handlers/reportHandler"));
const monitoringHandler_1 = __importDefault(require("./handlers/monitoringHandler"));
const blaiseStatusHandler_1 = __importDefault(require("./handlers/blaiseStatusHandler"));
const questionnaireInstallStatusHandler_1 = __importDefault(require("./handlers/questionnaireInstallStatusHandler"));
const errorLogsHandler_1 = __importDefault(require("./handlers/errorLogsHandler"));
function NewServer(blaiseApiClient, cache, config) {
    const server = (0, express_1.default)();
    const buildFolder = "../build";
    server.set("views", path_1.default.join(__dirname, buildFolder));
    server.engine("html", ejs_1.default.renderFile);
    server.use("/static", express_1.default.static(path_1.default.join(__dirname, `${buildFolder}/static`)));
    server.use(express_1.default.json());
    server.use(express_1.default.urlencoded({ extended: true }));
    //define handlers
    server.use("/", (0, healthCheckHandler_1.default)());
    server.use("/", (0, questionnaireListHandler_1.default)(blaiseApiClient, cache, config));
    server.use("/", (0, reportHandler_1.default)(blaiseApiClient, cache, config));
    server.use("/", (0, monitoringHandler_1.default)());
    server.use("/", (0, blaiseStatusHandler_1.default)(blaiseApiClient));
    server.use("/", (0, questionnaireInstallStatusHandler_1.default)(blaiseApiClient, config));
    server.use("/", (0, errorLogsHandler_1.default)());
    //define entry point
    server.use(function (_req, res) {
        res.render("index.html");
    });
    server.use(function (_err, _req, res, _next) {
        void _next;
        res.status(500).sendFile(path_1.default.join(__dirname, "../views/500.html"));
    });
    return server;
}
exports.default = NewServer;
//# sourceMappingURL=server.js.map