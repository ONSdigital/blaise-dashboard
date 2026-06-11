"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlaiseApiClient = exports.QuestionnaireListMockObject = exports.CaseOutcome = void 0;
var CaseOutcome;
(function (CaseOutcome) {
    CaseOutcome[CaseOutcome["None"] = 0] = "None";
    CaseOutcome[CaseOutcome["Completed"] = 110] = "Completed";
    CaseOutcome[CaseOutcome["CompletedNudge"] = 120] = "CompletedNudge";
    CaseOutcome[CaseOutcome["CompletedProxy"] = 130] = "CompletedProxy";
    CaseOutcome[CaseOutcome["Partial"] = 210] = "Partial";
    CaseOutcome[CaseOutcome["AppointmentMade"] = 300] = "AppointmentMade";
    CaseOutcome[CaseOutcome["NonContact"] = 310] = "NonContact";
    CaseOutcome[CaseOutcome["HQRefusal"] = 430] = "HQRefusal";
    CaseOutcome[CaseOutcome["NotAvailable"] = 440] = "NotAvailable";
    CaseOutcome[CaseOutcome["HardRefusal"] = 460] = "HardRefusal";
    CaseOutcome[CaseOutcome["SoftRefusal"] = 461] = "SoftRefusal";
    CaseOutcome[CaseOutcome["LanguageDifficultiesHeadOffice"] = 541] = "LanguageDifficultiesHeadOffice";
    CaseOutcome[CaseOutcome["LanguageDifficultiesInterviewer"] = 542] = "LanguageDifficultiesInterviewer";
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    CaseOutcome[CaseOutcome["WrongNumber"] = 542] = "WrongNumber";
    CaseOutcome[CaseOutcome["DeleteRequestedCompleted"] = 561] = "DeleteRequestedCompleted";
    CaseOutcome[CaseOutcome["DeleteRequestedPartial"] = 562] = "DeleteRequestedPartial";
    CaseOutcome[CaseOutcome["IneligibleVacant"] = 540] = "IneligibleVacant";
    CaseOutcome[CaseOutcome["IneligibleNonResidential"] = 551] = "IneligibleNonResidential";
    CaseOutcome[CaseOutcome["IneligibleInstitution"] = 560] = "IneligibleInstitution";
    CaseOutcome[CaseOutcome["IneligibleSecondHome"] = 580] = "IneligibleSecondHome";
    CaseOutcome[CaseOutcome["ConcernsWontTakePart"] = 360] = "ConcernsWontTakePart";
    CaseOutcome[CaseOutcome["RejectTandCs"] = 380] = "RejectTandCs";
    CaseOutcome[CaseOutcome["LostAccessCode"] = 373] = "LostAccessCode";
    CaseOutcome[CaseOutcome["UnableToComplete"] = 370] = "UnableToComplete";
    CaseOutcome[CaseOutcome["NoInternetAccess"] = 371] = "NoInternetAccess";
    CaseOutcome[CaseOutcome["RequestedDifferentMode"] = 372] = "RequestedDifferentMode";
    CaseOutcome[CaseOutcome["NoTraceOfAddress"] = 510] = "NoTraceOfAddress";
    CaseOutcome[CaseOutcome["Under16"] = 631] = "Under16";
    CaseOutcome[CaseOutcome["WrongAddress"] = 640] = "WrongAddress";
    CaseOutcome[CaseOutcome["BrailleRequested"] = 411] = "BrailleRequested";
    CaseOutcome[CaseOutcome["LargePrintRequested"] = 412] = "LargePrintRequested";
    CaseOutcome[CaseOutcome["OtherFormat"] = 413] = "OtherFormat";
    CaseOutcome[CaseOutcome["DeleteRequested"] = 390] = "DeleteRequested";
    CaseOutcome[CaseOutcome["RequestedCopyOfData"] = 791] = "RequestedCopyOfData";
    CaseOutcome[CaseOutcome["ClarificationOnStudyRequested"] = 792] = "ClarificationOnStudyRequested";
    CaseOutcome[CaseOutcome["AssistanceRequested"] = 793] = "AssistanceRequested";
    CaseOutcome[CaseOutcome["RequestForContext"] = 794] = "RequestForContext";
    CaseOutcome[CaseOutcome["QuestionProblem"] = 795] = "QuestionProblem";
})(CaseOutcome || (exports.CaseOutcome = CaseOutcome = {}));
exports.QuestionnaireListMockObject = [
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
class BlaiseApiClient {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async getQuestionnaires(_serverPark) {
        void _serverPark;
        return exports.QuestionnaireListMockObject;
    }
    async getCaseStatus(_questionnaireName) {
        void _questionnaireName;
        return [];
    }
}
exports.BlaiseApiClient = BlaiseApiClient;
exports.default = BlaiseApiClient;
