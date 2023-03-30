import * as monitoring from "./monitoring";
import { getMonitoringUptimeCheckTimeSeries } from "./monitoring";

import { mockHealthCheckList } from "../blaiseApi/testFixtures";
import { MonitoringDataModel } from "../monitoringDataModel";
import { google } from "@google-cloud/monitoring/build/protos/protos";

type GetUptimeChecksConfigsResult = [google.monitoring.v3.IUptimeCheckConfig[], google.monitoring.v3.IListUptimeCheckConfigsRequest | null, google.monitoring.v3.IListUptimeCheckConfigsResponse];

jest.spyOn(monitoring , "getUptimeChecksConfigs").mockReturnValue(Promise.resolve( [[], null, []] as GetUptimeChecksConfigsResult));
jest.spyOn(monitoring , "listTimeSeries").mockReturnValue(Promise.resolve( [[], null, []]  ) as ReturnType <typeof monitoring.listTimeSeries> );


describe("Get all uptime checks from API", () => {
    
    it("should return a 200 status and a json list of 1 items when API returns a 1 item list", async () => {
        getMonitoringUptimeCheckTimeSeries("anything");
    });

    // it("should return a 500 status direct from the API", async () => {
    //     getMonitoringUptimeCheckTimeSeriesMock.mockImplementation(() => Promise.reject("Error getting uptime checks"));
    //     const response = await request.get("/api/monitoring");
    //     expect(response.status).toEqual(500); 
    //     expect(response.body).toEqual("Failed to get monitoring uptimeChecks config data");
    // });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
       
    });
});
