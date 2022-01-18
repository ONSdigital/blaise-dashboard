import {Outcome} from "blaise-api-node-client";

export const mockInstrumentList = [
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
        }]

export const mockCaselist = [
            {
                primaryKey: "1000001" ,
                outcome: Outcome.Completed
            },
            {
                primaryKey: "1000002" ,
                outcome: Outcome.Completed
            },
            {
                primaryKey: "1000003" ,
                outcome: Outcome.None
            },
            {
                primaryKey: "1000004" ,
                outcome: Outcome.Partial
            },
            {
                primaryKey: "1000005" ,
                outcome: Outcome.AppointmentMade
            },
            {
                primaryKey: "1000006" ,
                outcome: Outcome.NonContact
            },
            {
                primaryKey: "1000007" ,
                outcome: 999
            }]