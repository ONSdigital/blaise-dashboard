export type Questionnaire = {
    name: string;
    installDate: string;
    serverParkName: string;
    fieldPeriod: string;
};
export declare enum CaseOutcome {
    None = 0,
    Completed = 110,
    CompletedNudge = 120,
    CompletedProxy = 130,
    Partial = 210,
    AppointmentMade = 300,
    NonContact = 310,
    HQRefusal = 430,
    NotAvailable = 440,
    HardRefusal = 460,
    SoftRefusal = 461,
    LanguageDifficultiesHeadOffice = 541,
    LanguageDifficultiesInterviewer = 542,
    WrongNumber = 542,
    DeleteRequestedCompleted = 561,
    DeleteRequestedPartial = 562,
    IneligibleVacant = 540,
    IneligibleNonResidential = 551,
    IneligibleInstitution = 560,
    IneligibleSecondHome = 580,
    ConcernsWontTakePart = 360,
    RejectTandCs = 380,
    LostAccessCode = 373,
    UnableToComplete = 370,
    NoInternetAccess = 371,
    RequestedDifferentMode = 372,
    NoTraceOfAddress = 510,
    Under16 = 631,
    WrongAddress = 640,
    BrailleRequested = 411,
    LargePrintRequested = 412,
    OtherFormat = 413,
    DeleteRequested = 390,
    RequestedCopyOfData = 791,
    ClarificationOnStudyRequested = 792,
    AssistanceRequested = 793,
    RequestForContext = 794,
    QuestionProblem = 795
}
export type CaseStatus = {
    primaryKey: string;
    outcome: CaseOutcome | number;
};
export declare const QuestionnaireListMockObject: Questionnaire[];
export declare class BlaiseApiClient {
    baseUrl: string;
    constructor(baseUrl: string);
    getQuestionnaires(_serverPark: string): Promise<Questionnaire[]>;
    getCaseStatus(_questionnaireName: string): Promise<CaseStatus[]>;
}
export default BlaiseApiClient;
//# sourceMappingURL=blaiseApiNodeClientMock.d.ts.map