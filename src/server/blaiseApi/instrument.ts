import BlaiseApiClient, { Instrument } from "blaise-api-node-client";
import { Config } from "../config";
import NodeCache from "node-cache";


export async function getInstruments(
    blaiseApiClient: BlaiseApiClient,
    cache: NodeCache, config: Config,
    instrumentTLA: string | undefined = undefined
): Promise<Instrument[]> {
    let listOfInstrument: Instrument[] | undefined = cache.get("instruments");
    if (listOfInstrument == undefined) {
        listOfInstrument = await blaiseApiClient.getInstruments(config.ServerPark);
        cache.set("instruments", listOfInstrument);
    } else {
        console.log("hit cache for get instruments");
    }
    if (instrumentTLA) {
        listOfInstrument = filterInstruments(listOfInstrument, instrumentTLA);
    }
    return listOfInstrument;
}

export function filterInstruments(listOfInstrument: Instrument[], instrumentTLA: string): Instrument[] {
    return listOfInstrument.filter((instrument) => { return instrument.name.startsWith(instrumentTLA); });
}
