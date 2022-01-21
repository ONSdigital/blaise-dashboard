import {Outcome} from "blaise-api-node-client";
import {isCompleted} from "./outcomes";

describe("Test the outcome codes are completed codes", () => {
    it.each([
        [Outcome.Completed],
        [Outcome.CompletedNudge],
        [Outcome.ConcernsWontTakePart],
        [Outcome.UnableToComplete],
        [Outcome.NoInternetAccess],
        [Outcome.RequestedDifferentMode],
        [Outcome.LostAccessCode],
        [Outcome.RejectTandCs],
        [Outcome.DeleteRequested],
        [Outcome.BrailleRequested],
        [Outcome.LargePrintRequested],
        [Outcome.OtherFormat],
        [Outcome.HQRefusal],
        [Outcome.NotAvailable],
        [Outcome.HardRefusal],
        [Outcome.SoftRefusal],
        [Outcome.NoTraceOfAddress],
        [Outcome.IneligibleVacant],
        [Outcome.LanguageDifficultiesHeadOffice],
        [Outcome.LanguageDifficultiesInterviewer],
        [Outcome.WrongNumber],
        [Outcome.IneligibleNonResidential],
        [Outcome.IneligibleInstitution],
        [Outcome.DeleteRequestedCompleted],
        [Outcome.DeleteRequestedPartial],
        [Outcome.IneligibleSecondHome],
        [Outcome.Under16],
        [Outcome.WrongAddress],
        [Outcome.RequestedCopyOfData],
        [Outcome.ClarificationOnStudyRequested],
        [Outcome.AssistanceRequested],
        [Outcome.RequestForContext],
        [Outcome.QuestionProblem]
    ])("should return true if the outcome code is a completed code", (outcome: Outcome) => {
        expect(isCompleted(outcome)).toBeTruthy();
    });


    it.each([
        [Outcome.None],
        [Outcome.Partial],
        [Outcome.AppointmentMade],
        [Outcome.NonContact]
    ])("should return false if the outcome code is not a completed code", (outcome: Outcome) => {
        expect(isCompleted(outcome)).toBeFalsy();
    });
});

