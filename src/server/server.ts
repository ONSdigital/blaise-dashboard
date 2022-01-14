import express, { Request, Response, Express } from "express";
import path from "path";
import ejs from "ejs";
import HealthCheckHandler from "./handlers/healthCheckHandler";
import InstrumentListHandler from "./handlers/instrumentListHandler";

function NewServer(): Express {
    const server = express();
    const buildFolder = "../build";
    server.set("views", path.join(__dirname, buildFolder));
    server.engine("html", ejs.renderFile);
    server.use("/static", express.static(path.join(__dirname, `${buildFolder}/static`)));

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    //define handlers
    server.use("/", HealthCheckHandler());
    server.use("/", InstrumentListHandler());

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
