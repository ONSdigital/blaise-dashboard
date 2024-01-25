import express, { Request, Response, Router } from "express";
import BlaiseApiClient from "blaise-api-node-client";
import { Config } from "../config";
import { getQuestionnaires } from "../blaiseApi/questionnaires";
import NodeCache from "node-cache";

export default function NewQuestionnaireListHandler(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config): Router {
    const router = express.Router();

    const questionnaireHandler = new QuestionnaireListHandler(blaiseApiClient, cache, config);
    return router.get("/api/questionnaires", questionnaireHandler.GetListOfQuestionnaires);
}

export class QuestionnaireListHandler {
    blaiseApiClient: BlaiseApiClient;
    cache: NodeCache;
    config: Config;

    constructor(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config) {
        this.blaiseApiClient = blaiseApiClient;
        this.cache = cache;
        this.config = config;
        this.GetListOfQuestionnaires = this.GetListOfQuestionnaires.bind(this);
    }

    async GetListOfQuestionnaires(req: Request, res: Response): Promise<Response> {
        try {
            const questionnaires = await getQuestionnaires(this.blaiseApiClient, this.cache, this.config, "OPN");

            return res.status(200).json(questionnaires);
        } catch (error: unknown) {
            console.error(`Response: ${error}`);
            return res.status(500).json(`Failed to get questionnaires installed on server park ${this.config.ServerPark}`);
        }
    }
}
