import express, { Request, Response, Router } from "express";
import { BlaiseApiClient, Questionnaire } from "blaise-api-node-client";
import { Config } from "../config";

export type QuestionnaireInstallStatus = {
    questionnaireName: string;
    totalNodes: number;
    activeNodes: number;
    activeOnAllNodes: boolean;
};

function isNodeActive(status: string | undefined): boolean {
    return status?.toLowerCase() === "active";
}

export function buildQuestionnaireInstallStatus(questionnaire: Questionnaire): QuestionnaireInstallStatus {
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

export async function getQuestionnaireInstallStatuses(
    blaiseApiClient: BlaiseApiClient,
    config: Config
): Promise<QuestionnaireInstallStatus[]> {
    const questionnaires = await blaiseApiClient.getQuestionnaires(config.ServerPark);

    const detailedQuestionnaires = await Promise.all(
        questionnaires.map((questionnaire) =>
            blaiseApiClient.getQuestionnaire(config.ServerPark, questionnaire.name)
        )
    );

    return detailedQuestionnaires
        .map((questionnaire) => buildQuestionnaireInstallStatus(questionnaire))
        .sort((a, b) => a.questionnaireName.localeCompare(b.questionnaireName));
}

export default function questionnaireInstallStatusHandler(
    blaiseApiClient: BlaiseApiClient,
    config: Config
): Router {
    const router = express.Router();

    return router.get("/api/questionnaires/install-status", async (req: Request, res: Response) => {
        try {
            const installStatuses = await getQuestionnaireInstallStatuses(blaiseApiClient, config);
            return res.status(200).json(installStatuses);
        } catch (error: unknown) {
            console.error("Failed to get questionnaire install status", error);
            return res.status(500).json("Unable to get questionnaire install status.");
        }
    });
}