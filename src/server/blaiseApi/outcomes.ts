import {Outcome} from "blaise-api-node-client";

const completedOutcomes: Outcome[] = [
    Outcome.Completed,
    Outcome.CompletedNudge,
    Outcome.ConcernsWontTakePart,
    Outcome.UnableToComplete,
    Outcome.NoInternetAccess,
    Outcome.RequestedDifferentMode,
    Outcome.LostAccessCode,
    Outcome.RejectTandCs,
    Outcome.DeleteRequested,
    Outcome.BrailleRequested,
    Outcome.LargePrintRequested,
    Outcome.OtherFormat,
    Outcome.HQRefusal,
    Outcome.NotAvailable,
    Outcome.HardRefusal,
    Outcome.SoftRefusal,
    Outcome.NoTraceOfAddress,
    Outcome.IneligibleVacant,
    Outcome.LanguageDifficultiesHeadOffice,
    Outcome.LanguageDifficultiesInterviewer,
    Outcome.WrongNumber,
    Outcome.IneligibleNonResidential,
    Outcome.IneligibleInstitution,
    Outcome.DeleteRequestedCompleted,
    Outcome.DeleteRequestedPartial,
    Outcome.IneligibleSecondHome,
    Outcome.Under16,
    Outcome.WrongAddress,
    Outcome.RequestedCopyOfData,
    Outcome.ClarificationOnStudyRequested,
    Outcome.AssistanceRequested,
    Outcome.RequestForContext,
    Outcome.QuestionProblem
];

const notCompletedOutcomes: Outcome[] = [
    Outcome.None,
    Outcome.Partial,
    Outcome.AppointmentMade,
    Outcome.NonContact
];

export function isCompleted(outcome: Outcome): boolean {
    return completedOutcomes.includes(outcome);
}

export function isNotCompleted(outcome: Outcome): boolean {
    return notCompletedOutcomes.includes(outcome);
}