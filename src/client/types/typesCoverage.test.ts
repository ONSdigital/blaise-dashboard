import {
    caseCompletionReportTypeModuleLoaded
} from "./caseCompletionReport";
import {
    monitoringDataModelTypeModuleLoaded
} from "./monitoringDataModel";

describe("client type modules", () => {
    it("loads case completion type module", () => {
        expect(caseCompletionReportTypeModuleLoaded).toBe(true);
    });

    it("loads monitoring data model type module", () => {
        expect(monitoringDataModelTypeModuleLoaded).toBe(true);
    });
});
