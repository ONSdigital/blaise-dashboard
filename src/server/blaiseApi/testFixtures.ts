import {CaseOutcome} from "blaise-api-node-client";

export const mockQuestionnaireList = [
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
        }];

export const mockCaseList = [
            {
                primaryKey: "1000001" ,
                outcome: CaseOutcome.Completed
            },
            {
                primaryKey: "1000002" ,
                outcome: CaseOutcome.Completed
            },
            {
                primaryKey: "1000003" ,
                outcome: CaseOutcome.None
            },
            {
                primaryKey: "1000004" ,
                outcome: CaseOutcome.Partial
            },
            {
                primaryKey: "1000005" ,
                outcome: CaseOutcome.AppointmentMade
            },
            {
                primaryKey: "1000006" ,
                outcome: CaseOutcome.NonContact
            },
            {
                primaryKey: "1000007" ,
                outcome: 999
            }];

export const mockHealthCheckList = [
    {
        hostname: "dev-bts.social-surveys.gcp.onsdigital.uk",
        regions:[
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