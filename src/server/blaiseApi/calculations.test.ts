import {calculateCaseTotals, calculatePercentComplete} from "./calculations";
import {CaseOutcome} from "blaise-api-node-client";

describe("Test that the backend calculations are correct", () => {
    describe("When two cases are completed in an questionnaire", () => {
        it("then it should return the total number of cases (2) in that questionnaire", () => {
            const testData = [
                {
                    primaryKey: "123456789",
                    outcome: CaseOutcome.Completed
                },
                {
                    primaryKey: "987654321",
                    outcome: CaseOutcome.Completed
                }];

            expect(calculateCaseTotals(testData).Total).toBe(2);
        });
    });

    it("should return the correct number of complete and incomplete cases in an questionnaire", () => {
        // Unknown status codes count as completed
        const testData = [
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
                outcome: 999 // Unkown status code
            },
        ];

        const testInfo = calculateCaseTotals(testData);

        expect(testInfo.Total).toBe(7);
        expect(testInfo.Complete).toBe(3);
        expect(testInfo.NotComplete).toBe(4);
    });

    it("calculates the correct percentage of completed cases to 2dp", () => {
        // Unknown status codes count as completed
        const testData = {
        Total: 10,
        Complete: 7,
        NotComplete: 3,
    };

        expect(calculatePercentComplete(testData)).toEqual(70.00);
    });

        it("calculates the correct percentage of completed cases to 2dp when result is not an integer", () => {
        // Unknown status codes count as completed
        const testData = {
        Total: 12,
        Complete: 7,
        NotComplete: 5,
    };

        expect(calculatePercentComplete(testData)).toEqual(58.33);
    });

   it("calculates shows 0% when there are no cases", () => {
        // Unknown status codes count as completed
        const testData = {
        Total: 0,
        Complete: 0,
        NotComplete: 0,
    };

        expect(calculatePercentComplete(testData)).toEqual(0.00);
    });

});