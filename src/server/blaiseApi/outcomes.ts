import {CaseOutcome} from "blaise-api-node-client";

const completedOutcomes: CaseOutcome[] = [
    CaseOutcome.Completed,
    CaseOutcome.CompletedNudge,
    CaseOutcome.ConcernsWontTakePart,
    CaseOutcome.UnableToComplete,
    CaseOutcome.NoInternetAccess,
    CaseOutcome.RequestedDifferentMode,
    CaseOutcome.LostAccessCode,
    CaseOutcome.RejectTandCs,
    CaseOutcome.DeleteRequested,
    CaseOutcome.BrailleRequested,
    CaseOutcome.LargePrintRequested,
    CaseOutcome.OtherFormat,
    CaseOutcome.HQRefusal,
    CaseOutcome.NotAvailable,
    CaseOutcome.HardRefusal,
    CaseOutcome.SoftRefusal,
    CaseOutcome.NoTraceOfAddress,
    CaseOutcome.IneligibleVacant,
    CaseOutcome.LanguageDifficultiesHeadOffice,
    CaseOutcome.LanguageDifficultiesInterviewer,
    CaseOutcome.WrongNumber,
    CaseOutcome.IneligibleNonResidential,
    CaseOutcome.IneligibleInstitution,
    CaseOutcome.DeleteRequestedCompleted,
    CaseOutcome.DeleteRequestedPartial,
    CaseOutcome.IneligibleSecondHome,
    CaseOutcome.Under16,
    CaseOutcome.WrongAddress,
    CaseOutcome.RequestedCopyOfData,
    CaseOutcome.ClarificationOnStudyRequested,
    CaseOutcome.AssistanceRequested,
    CaseOutcome.RequestForContext,
    CaseOutcome.QuestionProblem
];

const notCompletedOutcomes: CaseOutcome[] = [
    CaseOutcome.None,
    CaseOutcome.Partial,
    CaseOutcome.AppointmentMade,
    CaseOutcome.NonContact
];

export function isCompleted(outcome: CaseOutcome): boolean {
    return completedOutcomes.includes(outcome);
}

export function isNotCompleted(outcome: CaseOutcome): boolean {
    return notCompletedOutcomes.includes(outcome);
}