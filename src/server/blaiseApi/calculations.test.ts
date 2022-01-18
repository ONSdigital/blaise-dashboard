import {calculateCaseTotals, calculatePercentComplete} from "./calculations";
import {Outcome} from "blaise-api-node-client";

describe("Test that the backend calculations are correct", () => {
    describe("When two cases are completed in an instrument", () => {
        it("then it should return the total number of cases (2) in that instrument", () => {
            const testData = [
                {
                    primaryKey: "123456789",
                    outcome: Outcome.Completed
                },
                {
                    primaryKey: "987654321",
                    outcome: Outcome.Completed
                }]

            expect(calculateCaseTotals(testData).Total).toBe(2)
        });
    });

    it("should return the correct number of complete and incomplete cases in an instrument", () => {
        // Unknown status codes count as completed
        const testData = [
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
                outcome: 999 // Unkown status code
            },
        ]

        const testInfo = calculateCaseTotals(testData)

        expect(testInfo.Total).toBe(7)
        expect(testInfo.Complete).toBe(3)
        expect(testInfo.NotComplete).toBe(4)
    });

    it("calculates the correct percentage of completed cases to 2dp", () => {
        // Unknown status codes count as completed
        const testData = {
        Total: 10,
        Complete: 7,
        NotComplete: 3,
    }

        expect(calculatePercentComplete(testData)).toEqual(70.00)
    });

        it("calculates the correct percentage of completed cases to 2dp when result is not an integer", () => {
        // Unknown status codes count as completed
        const testData = {
        Total: 12,
        Complete: 7,
        NotComplete: 5,
    }

        expect(calculatePercentComplete(testData)).toEqual(58.33)
    });
})