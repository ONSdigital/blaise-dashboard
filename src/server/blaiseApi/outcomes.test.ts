import {CaseOutcome} from "blaise-api-node-client";
import {isCompleted} from "./outcomes";

describe("Test the outcome codes are completed codes", () => {
    it.each([
        [CaseOutcome.Completed],
        [CaseOutcome.CompletedNudge],
        [CaseOutcome.ConcernsWontTakePart],
        [CaseOutcome.UnableToComplete],
        [CaseOutcome.NoInternetAccess],
        [CaseOutcome.RequestedDifferentMode],
        [CaseOutcome.LostAccessCode],
        [CaseOutcome.RejectTandCs],
        [CaseOutcome.DeleteRequested],
        [CaseOutcome.BrailleRequested],
        [CaseOutcome.LargePrintRequested],
        [CaseOutcome.OtherFormat],
        [CaseOutcome.HQRefusal],
        [CaseOutcome.NotAvailable],
        [CaseOutcome.HardRefusal],
        [CaseOutcome.SoftRefusal],
        [CaseOutcome.NoTraceOfAddress],
        [CaseOutcome.IneligibleVacant],
        [CaseOutcome.LanguageDifficultiesHeadOffice],
        [CaseOutcome.LanguageDifficultiesInterviewer],
        [CaseOutcome.WrongNumber],
        [CaseOutcome.IneligibleNonResidential],
        [CaseOutcome.IneligibleInstitution],
        [CaseOutcome.DeleteRequestedCompleted],
        [CaseOutcome.DeleteRequestedPartial],
        [CaseOutcome.IneligibleSecondHome],
        [CaseOutcome.Under16],
        [CaseOutcome.WrongAddress],
        [CaseOutcome.RequestedCopyOfData],
        [CaseOutcome.ClarificationOnStudyRequested],
        [CaseOutcome.AssistanceRequested],
        [CaseOutcome.RequestForContext],
        [CaseOutcome.QuestionProblem]
    ])("should return true if the outcome code is a completed code", (outcome: CaseOutcome) => {
        expect(isCompleted(outcome)).toBeTruthy();
    });


    it.each([
        [CaseOutcome.None],
        [CaseOutcome.Partial],
        [CaseOutcome.AppointmentMade],
        [CaseOutcome.NonContact]
    ])("should return false if the outcome code is not a completed code", (outcome: CaseOutcome) => {
        expect(isCompleted(outcome)).toBeFalsy();
    });
});

