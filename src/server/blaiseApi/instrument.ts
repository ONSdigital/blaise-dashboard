import BlaiseApiClient, {Instrument} from "blaise-api-node-client";
import {Config} from "../config";


export async function getInstruments(blaiseApiClient: BlaiseApiClient, config: Config, instrumentTLA: string|undefined = undefined): Promise<Instrument[]> {
    let listOfInstrument = await blaiseApiClient.getInstruments(config.ServerPark)
    if (instrumentTLA) {
        listOfInstrument = filterInstruments(listOfInstrument, instrumentTLA)
    }
    return listOfInstrument
}

export function filterInstruments(listOfInstrument: Instrument[], instrumentTLA: string): Instrument[] {
    return listOfInstrument.filter((instrument) => {return instrument.name.startsWith(instrumentTLA)});
}