"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuestionnaireInstallStatus = buildQuestionnaireInstallStatus;
exports.getQuestionnaireInstallStatuses = getQuestionnaireInstallStatuses;
exports.default = questionnaireInstallStatusHandler;
const express_1 = __importDefault(require("express"));
function isNodeActive(status) {
    return status?.toLowerCase() === "active";
}
function buildQuestionnaireInstallStatus(questionnaire) {
    const nodes = questionnaire.nodes ?? [];
    const activeNodes = nodes.filter((node) => isNodeActive(node.nodeStatus)).length;
    const totalNodes = nodes.length;
    return {
        questionnaireName: questionnaire.name,
        totalNodes,
        activeNodes,
        activeOnAllNodes: totalNodes > 0 && activeNodes === totalNodes
    };
}
async function getQuestionnaireInstallStatuses(blaiseApiClient, config) {
    const questionnaires = await blaiseApiClient.getQuestionnaires(config.ServerPark);
    const detailedQuestionnaires = await Promise.all(questionnaires.map((questionnaire) => blaiseApiClient.getQuestionnaire(config.ServerPark, questionnaire.name)));
    return detailedQuestionnaires
        .map((questionnaire) => buildQuestionnaireInstallStatus(questionnaire))
        .sort((a, b) => a.questionnaireName.localeCompare(b.questionnaireName));
}
function questionnaireInstallStatusHandler(blaiseApiClient, config) {
    const router = express_1.default.Router();
    return router.get("/api/questionnaires/install-status", async (req, res) => {
        try {
            const installStatuses = await getQuestionnaireInstallStatuses(blaiseApiClient, config);
            return res.status(200).json(installStatuses);
        }
        catch (error) {
            console.error("Failed to get questionnaire install status", error);
            return res.status(500).json("Unable to get questionnaire install status.");
        }
    });
}
