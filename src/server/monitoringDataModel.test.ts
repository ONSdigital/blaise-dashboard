import { monitoringDataModelModuleLoaded } from "./monitoringDataModel.js";

describe("server monitoring data model module", () => {
  it("loads the module", () => {
    expect(monitoringDataModelModuleLoaded).toBe(true);
  });
});
