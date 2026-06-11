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
    //define entry point
    server.get("/{*splat}", function (req, res) {
        res.render("index.html");
    });
    server.use(function (err, req, res) {
        res.render("../src/server/views/500.html", {});
    });
    return server;
}
exports.default = NewServer;
