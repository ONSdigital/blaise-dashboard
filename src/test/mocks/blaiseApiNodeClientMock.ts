export type Questionnaire = {
    name: string;
    installDate: string;
    serverParkName: string;
    fieldPeriod: string;
};

export enum CaseOutcome {
    None = 0,
    Completed = 1,
    Partial = 2,
    AppointmentMade = 3,
    NonContact = 4,
    CompletedNudge = 5,
    ConcernsWontTakePart = 6,
    UnableToComplete = 7,
    NoInternetAccess = 8,
    RequestedDifferentMode = 9,
    LostAccessCode = 10,
    RejectTandCs = 11,
    DeleteRequested = 12,
    BrailleRequested = 13,
    LargePrintRequested = 14,
    OtherFormat = 15,
    HQRefusal = 16,
    NotAvailable = 17,
    HardRefusal = 18,
    SoftRefusal = 19,
    NoTraceOfAddress = 20,
    IneligibleVacant = 21,
    LanguageDifficultiesHeadOffice = 22,
    LanguageDifficultiesInterviewer = 23,
    WrongNumber = 24,
    IneligibleNonResidential = 25,
    IneligibleInstitution = 26,
    DeleteRequestedCompleted = 27,
    DeleteRequestedPartial = 28,
    IneligibleSecondHome = 29,
    Under16 = 30,
    WrongAddress = 31,
    RequestedCopyOfData = 32,
    ClarificationOnStudyRequested = 33,
    AssistanceRequested = 34,
    RequestForContext = 35,
    QuestionProblem = 36
}

export type CaseStatus = {
    primaryKey: string;
    outcome: CaseOutcome | number;
};

export const QuestionnaireListMockObject: Questionnaire[] = [
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

export default class BlaiseApiClient {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getQuestionnaires(_serverPark: string): Promise<Questionnaire[]> {
        void _serverPark;
        return QuestionnaireListMockObject;
    }

    async getCaseStatus(_questionnaireName: string): Promise<CaseStatus[]> {
        void _questionnaireName;
        return [];
    }
}
