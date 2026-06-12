import { BlaiseApiClient, Questionnaire } from "blaise-api-node-client";
import { Config } from "../config.js";
import NodeCache from "node-cache";

export async function getQuestionnaires(
  blaiseApiClient: BlaiseApiClient,
  cache: NodeCache,
  config: Config,
  questionnaireTLA: string | undefined = undefined,
): Promise<readonly Questionnaire[]> {
  let listOfQuestionnaire =
    cache.get<readonly Questionnaire[]>("questionnaires");
  if (listOfQuestionnaire == undefined) {
    listOfQuestionnaire = await blaiseApiClient.getQuestionnaires(
      config.ServerPark,
    );
    cache.set("questionnaires", listOfQuestionnaire);
  }

  if (listOfQuestionnaire == undefined) {
    return [];
  }

  if (questionnaireTLA) {
    return filterQuestionnaires(listOfQuestionnaire, questionnaireTLA);
  }

  return listOfQuestionnaire;
}

export function filterQuestionnaires(
  listOfQuestionnaire: readonly Questionnaire[],
  questionnaireTLA: string,
): Questionnaire[] {
  return listOfQuestionnaire.filter((questionnaire) => {
    return questionnaire.name.startsWith(questionnaireTLA);
  });
}
