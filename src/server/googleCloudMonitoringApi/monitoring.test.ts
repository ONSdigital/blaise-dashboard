import * as monitoring from "./monitoring";
import { getMonitoringUptimeCheckTimeSeries } from "./monitoring";

import { mockHealthCheckList } from "../blaiseApi/testFixtures";
import { MonitoringDataModel } from "../monitoringDataModel";
import { google } from "@google-cloud/monitoring/build/protos/protos";

type GetUptimeChecksConfigsResult = [google.monitoring.v3.IUptimeCheckConfig[], google.monitoring.v3.IListUptimeCheckConfigsRequest | null, google.monitoring.v3.IListUptimeCheckConfigsResponse];

jest.spyOn(monitoring , "getUptimeChecksConfigs").mockReturnValue(Promise.resolve( [[], null, []] as GetUptimeChecksConfigsResult));
//jest.spyOn(monitoring , "listTimeSeries").mockReturnValue(Promise.resolve( [[], null, []]  ) as ReturnType <typeof monitoring.listTimeSeries> );

import { getUptimeChecksConfigs } from "./monitoring";
const getUptimeChecksConfigsMock = getUptimeChecksConfigs as unknown as jest.Mock<Promise<GetUptimeChecksConfigsResult[]>>;


describe("Get all uptime checks from API", () => {
    
    it("should return a 200 status and a json list of 1 items when API returns a 1 item list", async () => {
        getUptimeChecksConfigsMock.mockImplementation(() => Promise.resolve([]));
        const response = await getMonitoringUptimeCheckTimeSeries("ons-blaise-v2-dev-sj02");
        expect(response).toStrictEqual([{"hostname":"unknown","regions":[{"region":"unknown", "status":"false"}]}]);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
       
    });
});
