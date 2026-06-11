import { Router } from "express";
import { BlaiseApiClient, Questionnaire } from "blaise-api-node-client";
import { Config } from "../config";
export type QuestionnaireInstallStatus = {
    questionnaireName: string;
    totalNodes: number;
    activeNodes: number;
    activeOnAllNodes: boolean;
};
export declare function buildQuestionnaireInstallStatus(questionnaire: Questionnaire): QuestionnaireInstallStatus;
export declare function getQuestionnaireInstallStatuses(blaiseApiClient: BlaiseApiClient, config: Config): Promise<QuestionnaireInstallStatus[]>;
export default function questionnaireInstallStatusHandler(blaiseApiClient: BlaiseApiClient, config: Config): Router;
//# sourceMappingURL=questionnaireInstallStatusHandler.d.ts.map