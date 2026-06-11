import { Request, Response, Router } from "express";
import { BlaiseApiClient } from "blaise-api-node-client";
import { Config } from "../config";
import NodeCache from "node-cache";
export default function NewQuestionnaireListHandler(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config): Router;
export declare class QuestionnaireListHandler {
    blaiseApiClient: BlaiseApiClient;
    cache: NodeCache;
    config: Config;
    constructor(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config);
    GetListOfQuestionnaires(req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=questionnaireListHandler.d.ts.map