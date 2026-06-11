import express, { Request, Response, Express, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import HealthCheckHandler from "./handlers/healthCheckHandler.js";
import QuestionnaireListHandler from "./handlers/questionnaireListHandler.js";
import { Config } from "./config.js";
import { BlaiseApiClient } from "blaise-api-node-client";
import caseReportHandler from "./handlers/reportHandler.js";
import NodeCache from "node-cache";
import monitoringHandler from "./handlers/monitoringHandler.js";
import blaiseStatusHandler from "./handlers/blaiseStatusHandler.js";
import questionnaireInstallStatusHandler from "./handlers/questionnaireInstallStatusHandler.js";
import errorLogsHandler from "./handlers/errorLogsHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function NewServer(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config): Express {
    const server = express();
    const buildFolder = "..";
    server.set("views", path.join(__dirname, buildFolder));
    server.engine("html", ejs.renderFile);
    server.use("/static", express.static(path.join(__dirname, `${buildFolder}/static`)));

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    //define handlers
    server.use("/", HealthCheckHandler());
    server.use("/", QuestionnaireListHandler(blaiseApiClient, cache, config));
    server.use("/", caseReportHandler(blaiseApiClient, cache, config));
    server.use("/", monitoringHandler());
    server.use("/", blaiseStatusHandler(blaiseApiClient));
    server.use("/", questionnaireInstallStatusHandler(blaiseApiClient, config));
    server.use("/", errorLogsHandler());

    //define entry point
    server.use(function (_req: Request, res: Response) {
        res.render("index.html");
    });

    server.use(function (_err: Error, _req: Request, res: Response, _next: NextFunction) {
        void _next;
        res.status(500).sendFile(path.join(__dirname, "../views/500.html"));
    });
    return server;
}

export default NewServer;
