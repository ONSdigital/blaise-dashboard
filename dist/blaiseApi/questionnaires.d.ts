import { BlaiseApiClient, Questionnaire } from "blaise-api-node-client";
import { Config } from "../config";
import NodeCache from "node-cache";
export declare function getQuestionnaires(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config, questionnaireTLA?: string | undefined): Promise<readonly Questionnaire[]>;
export declare function filterQuestionnaires(listOfQuestionnaire: readonly Questionnaire[], questionnaireTLA: string): Questionnaire[];
//# sourceMappingURL=questionnaires.d.ts.map