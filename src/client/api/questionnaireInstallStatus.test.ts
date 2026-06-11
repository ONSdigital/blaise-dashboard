import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getQuestionnaireInstallStatus } from "./questionnaireInstallStatus";

describe("Questionnaire Install Status API", () => {
    const mockAdapter = new MockAdapter(axios);

    it("returns questionnaire install status list", async () => {
        const responseBody = [
            {
                questionnaireName: "OPN2101A",
                totalNodes: 2,
                activeNodes: 2,
                activeOnAllNodes: true
            }
        ];

        mockAdapter.onGet("/api/questionnaires/install-status").reply(200, responseBody);

        const response = await getQuestionnaireInstallStatus();

        expect(response).toEqual(responseBody);
    });
});