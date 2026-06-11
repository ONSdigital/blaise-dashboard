import express from "express";
import supertest from "supertest";
import { BlaiseApiClient, Questionnaire } from "blaise-api-node-client";
import {
    buildQuestionnaireInstallStatus,
    getQuestionnaireInstallStatuses
} from "./questionnaireInstallStatusHandler.js";
import questionnaireInstallStatusHandler from "./questionnaireInstallStatusHandler.js";
import { Config } from "../config.js";

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

    it("builds activeOnAllNodes false when there are no nodes", () => {
        const status = buildQuestionnaireInstallStatus({
            name: "OPN2101A",
            installDate: "2024-01-01T00:00:00.000Z",
            serverParkName: "gusty",
            nodes: []
        } as Questionnaire);

        expect(status).toEqual({
            questionnaireName: "OPN2101A",
            totalNodes: 0,
            activeNodes: 0,
            activeOnAllNodes: false
        });
    });

    it("builds activeOnAllNodes false when nodes are undefined", () => {
        const status = buildQuestionnaireInstallStatus({
            name: "OPN2101A",
            installDate: "2024-01-01T00:00:00.000Z",
            serverParkName: "gusty"
        } as Questionnaire);

        expect(status).toEqual({
            questionnaireName: "OPN2101A",
            totalNodes: 0,
            activeNodes: 0,
            activeOnAllNodes: false
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

    it("default route returns 500 when install status retrieval throws", async () => {
        const blaiseApiClient = {
            getQuestionnaires: vi.fn(),
            getQuestionnaire: vi.fn()
        } as unknown as BlaiseApiClient;

        vi.mocked(blaiseApiClient.getQuestionnaires).mockRejectedValue(new Error("boom"));
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const app = express();
        app.use("/", questionnaireInstallStatusHandler(blaiseApiClient, config));

        const response = await supertest(app).get("/api/questionnaires/install-status");

        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual("Unable to get questionnaire install status.");
        expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get questionnaire install status", expect.any(Error));
    });

    it("default route returns install statuses on success", async () => {
        const blaiseApiClient = {
            getQuestionnaires: vi.fn(),
            getQuestionnaire: vi.fn()
        } as unknown as BlaiseApiClient;

        vi.mocked(blaiseApiClient.getQuestionnaires).mockResolvedValue([
            { name: "OPN2101A" }
        ] as Questionnaire[]);
        vi.mocked(blaiseApiClient.getQuestionnaire).mockResolvedValue({
            name: "OPN2101A",
            installDate: "2024-01-01T00:00:00.000Z",
            serverParkName: "gusty",
            nodes: [
                { nodeName: "node-1", nodeStatus: "Active" }
            ]
        } as Questionnaire);

        const app = express();
        app.use("/", questionnaireInstallStatusHandler(blaiseApiClient, config));

        const response = await supertest(app).get("/api/questionnaires/install-status");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([
            {
                questionnaireName: "OPN2101A",
                totalNodes: 1,
                activeNodes: 1,
                activeOnAllNodes: true
            }
        ]);
    });
});