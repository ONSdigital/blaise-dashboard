"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireListHandler = void 0;
exports.default = NewQuestionnaireListHandler;
const express_1 = __importDefault(require("express"));
const questionnaires_1 = require("../blaiseApi/questionnaires");
function NewQuestionnaireListHandler(blaiseApiClient, cache, config) {
    const router = express_1.default.Router();
    const questionnaireHandler = new QuestionnaireListHandler(blaiseApiClient, cache, config);
    return router.get("/api/questionnaires", questionnaireHandler.GetListOfQuestionnaires);
}
class QuestionnaireListHandler {
    blaiseApiClient;
    cache;
    config;
    constructor(blaiseApiClient, cache, config) {
        this.blaiseApiClient = blaiseApiClient;
        this.cache = cache;
        this.config = config;
        this.GetListOfQuestionnaires = this.GetListOfQuestionnaires.bind(this);
    }
    async GetListOfQuestionnaires(req, res) {
        try {
            const questionnaires = await (0, questionnaires_1.getQuestionnaires)(this.blaiseApiClient, this.cache, this.config);
            return res.status(200).json(questionnaires);
        }
        catch (error) {
            console.error(`Response: ${error}`);
            return res.status(500).json(`Failed to get questionnaires installed on server park ${this.config.ServerPark}`);
        }
    }
}
exports.QuestionnaireListHandler = QuestionnaireListHandler;
