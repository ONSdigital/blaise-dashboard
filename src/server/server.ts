import express, { Request, Response, Express } from "express";
import path from "path";
import ejs from "ejs";
import HealthCheckHandler from "./handlers/healthCheckHandler";
import QuestionnaireListHandler from "./handlers/questionnaireListHandler";
import { Config } from "./config";
import BlaiseApiClient from "blaise-api-node-client";
import caseReportHandler from "./handlers/reportHandler";
import NodeCache from "node-cache";
import monitoringHandler from "./handlers/monitoringHandler";

function NewServer(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config): Express {
    const server = express();
    const buildFolder = "../build";
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

    //define entry point
    server.get("*", function (req: Request, res: Response) {
        res.render("index.html");
    });

    server.use(function (err: Error, req: Request, res: Response) {
        res.render("../src/views/500.html", {});
    });
    return server;
}

export default NewServer;
