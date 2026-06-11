"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockHealthCheckList = exports.mockCaseList = exports.mockQuestionnaireList = void 0;
const blaise_api_node_client_1 = require("blaise-api-node-client");
exports.mockQuestionnaireList = [
    {
        name: "LMS2101_CC1",
        installDate: "210122",
        serverParkName: "gusty",
        fieldPeriod: "210122"
    },
    {
        name: "OPN2101A",
        installDate: "210122",
        serverParkName: "gusty",
        fieldPeriod: "210122"
    },
    {
        name: "OPN2007T",
        installDate: "210122",
        serverParkName: "gusty",
        fieldPeriod: "210122"
    }
];
exports.mockCaseList = [
    {
        primaryKey: "1000001",
        outcome: blaise_api_node_client_1.CaseOutcome.Completed
    },
    {
        primaryKey: "1000002",
        outcome: blaise_api_node_client_1.CaseOutcome.Completed
    },
    {
        primaryKey: "1000003",
        outcome: blaise_api_node_client_1.CaseOutcome.None
    },
    {
        primaryKey: "1000004",
        outcome: blaise_api_node_client_1.CaseOutcome.Partial
    },
    {
        primaryKey: "1000005",
        outcome: blaise_api_node_client_1.CaseOutcome.AppointmentMade
    },
    {
        primaryKey: "1000006",
        outcome: blaise_api_node_client_1.CaseOutcome.NonContact
    },
    {
        primaryKey: "1000007",
        outcome: 999
    }
];
exports.mockHealthCheckList = [
    {
        hostname: "dev-bts.social-surveys.gcp.onsdigital.uk",
        regions: [
            {
                region: "europe",
                status: "success"
            },
            {
                region: "apac-singapore",
                status: "error"
            },
            {
                region: "usa-oregon",
                status: "success"
            },
            {
                region: "sa-brazil-sao_paulo",
                status: "requestFailed"
            }
        ]
    }
];
//# sourceMappingURL=testFixtures.js.map