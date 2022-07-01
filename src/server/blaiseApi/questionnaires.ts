import BlaiseApiClient, { Questionnaire } from "blaise-api-node-client";
import { Config } from "../config";
import NodeCache from "node-cache";


export async function getQuestionnaires(
    blaiseApiClient: BlaiseApiClient,
    cache: NodeCache, config: Config,
    questionnaireTLA: string | undefined = undefined
): Promise<Questionnaire[]> {
    let listOfQuestionnaire: Questionnaire[] | undefined = cache.get("questionnaires");
    if (listOfQuestionnaire == undefined) {
        listOfQuestionnaire = await blaiseApiClient.getQuestionnaires(config.ServerPark);
        cache.set("questionnaires", listOfQuestionnaire);
    } else {
        console.log("hit cache for get questionnaires");
    }
    if (questionnaireTLA) {
        listOfQuestionnaire = filterQuestionnaires(listOfQuestionnaire, questionnaireTLA);
    }
    return listOfQuestionnaire;
}

export function filterQuestionnaires(listOfQuestionnaire: Questionnaire[], questionnaireTLA: string): Questionnaire[] {
    return listOfQuestionnaire.filter((questionnaire) => { return questionnaire.name.startsWith(questionnaireTLA); });
}
