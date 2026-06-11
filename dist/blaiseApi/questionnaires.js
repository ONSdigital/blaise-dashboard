"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionnaires = getQuestionnaires;
exports.filterQuestionnaires = filterQuestionnaires;
async function getQuestionnaires(blaiseApiClient, cache, config, questionnaireTLA = undefined) {
    let listOfQuestionnaire = cache.get("questionnaires");
    if (listOfQuestionnaire == undefined) {
        listOfQuestionnaire = await blaiseApiClient.getQuestionnaires(config.ServerPark);
        cache.set("questionnaires", listOfQuestionnaire);
    }
    else {
        console.log("hit cache for get questionnaires");
    }
    if (listOfQuestionnaire == undefined) {
        return [];
    }
    if (questionnaireTLA) {
        return filterQuestionnaires(listOfQuestionnaire, questionnaireTLA);
    }
    return listOfQuestionnaire;
}
function filterQuestionnaires(listOfQuestionnaire, questionnaireTLA) {
    return listOfQuestionnaire.filter((questionnaire) => { return questionnaire.name.startsWith(questionnaireTLA); });
}
