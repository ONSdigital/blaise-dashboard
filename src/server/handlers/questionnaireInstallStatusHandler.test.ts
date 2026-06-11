import express from "express";
import supertest from "supertest";
import { BlaiseApiClient, Questionnaire } from "blaise-api-node-client";
import {
    buildQuestionnaireInstallStatus,
    getQuestionnaireInstallStatuses
} from "./questionnaireInstallStatusHandler";
import { Config } from "../config";

const config: Config = {
    BlaiseApiUrl: "http://blaise-api.local",
    ServerPark: "gusty"
};

describe("Questionnaire Install Status Handler", () => {
    it("builds activeOnAllNodes true only when all nodes are active", () => {
        const status = buildQuestionnaireInstallStatus({
            name: "OPN2101A",
            installDate: "2024-01-01T00:00:00.000Z",
            serverParkName: "gusty",
            nodes: [
                { nodeName: "node-1", nodeStatus: "Active" },
                { nodeName: "node-2", nodeStatus: "Active" }
            ]
        } as Questionnaire);

        expect(status).toEqual({
            questionnaireName: "OPN2101A",
            totalNodes: 2,
            activeNodes: 2,
            activeOnAllNodes: true
        });
    });

    it("returns sorted install statuses from questionnaire node data", async () => {
        const blaiseApiClient = {
            getQuestionnaires: vi.fn(),
            getQuestionnaire: vi.fn()
        } as unknown as BlaiseApiClient;

        vi.mocked(blaiseApiClient.getQuestionnaires).mockResolvedValue([
            { name: "ZZZ2101A" },
            { name: "AAA2101A" }
        ] as Questionnaire[]);

        vi.mocked(blaiseApiClient.getQuestionnaire)
            .mockResolvedValueOnce({
                name: "ZZZ2101A",
                installDate: "2024-01-01T00:00:00.000Z",
                serverParkName: "gusty",
                nodes: [
                    { nodeName: "node-1", nodeStatus: "Active" },
                    { nodeName: "node-2", nodeStatus: "Installing" }
                ]
            } as Questionnaire)
            .mockResolvedValueOnce({
                name: "AAA2101A",
                installDate: "2024-01-01T00:00:00.000Z",
                serverParkName: "gusty",
                nodes: [
                    { nodeName: "node-1", nodeStatus: "Active" },
                    { nodeName: "node-2", nodeStatus: "Active" }
                ]
            } as Questionnaire);

        const statuses = await getQuestionnaireInstallStatuses(blaiseApiClient, config);

        expect(statuses).toEqual([
            {
                questionnaireName: "AAA2101A",
                totalNodes: 2,
                activeNodes: 2,
                activeOnAllNodes: true
            },
            {
                questionnaireName: "ZZZ2101A",
                totalNodes: 2,
                activeNodes: 1,
                activeOnAllNodes: false
            }
        ]);
    });

    it("returns a 500 response when Blaise requests fail", async () => {
        const blaiseApiClient = {
            getQuestionnaires: vi.fn(),
            getQuestionnaire: vi.fn()
        } as unknown as BlaiseApiClient;

        vi.mocked(blaiseApiClient.getQuestionnaires).mockRejectedValue(new Error("boom"));

        const app = express();
        app.get("/api/questionnaires/install-status", async (_req, res) => {
            try {
                const statuses = await getQuestionnaireInstallStatuses(blaiseApiClient, config);
                res.status(200).json(statuses);
            } catch {
                res.status(500).json("Unable to get questionnaire install status.");
            }
        });

        const response = await supertest(app).get("/api/questionnaires/install-status");

        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual("Unable to get questionnaire install status.");
    });
});