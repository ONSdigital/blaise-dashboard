import {filterInstruments, getInstruments} from "./instrument"
import BlaiseApiClient from "blaise-api-node-client";
import {GetConfigFromEnv} from "../config";
import {mockInstrumentList} from "./testFixtures";

jest.mock("blaise-api-node-client")
const config = GetConfigFromEnv();

BlaiseApiClient.prototype.getInstruments = jest.fn().mockImplementation(async () => {
    return Promise.resolve(mockInstrumentList)
})

const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

describe("Test that TLA filter returns surveys of interest", () => {
    it("should return OPN surveys only when OPN is passed as TLA argument", () => {
        expect(filterInstruments(mockInstrumentList, "OPN")).toEqual([
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
            }]
        )
    });
});

describe("getInstruments", () => {
    describe("when an instrumentTLA is provided", () => {
        it("returns a filtered list of instruments", async () => {
            const instruments = await getInstruments(blaiseApiClient, config, "OPN")
            expect(instruments).toHaveLength(2)
        })
    })

    describe("when an instrumentTLA is not provided", () => {
        it("returns an unfiltered list of instruments", async () => {
            const instruments = await getInstruments(blaiseApiClient, config)
            expect(instruments).toHaveLength(3)
        })
    })
})