import express, { Request, Response, Router } from "express";
import BlaiseApiClient from "blaise-api-node-client";
import {Config} from "../config";
import {getInstruments} from "../blaiseApi/instrument"

export default function NewInstrumentListHandler(blaiseApiClient: BlaiseApiClient, config: Config): Router {
    const router = express.Router();

    const instrumentHandler = new InstrumentListHandler(blaiseApiClient, config);
    return router.get("/api/instruments", instrumentHandler.GetListOfInstruments);
}

export class InstrumentListHandler {
    blaiseApiClient: BlaiseApiClient;
    config: Config;

    constructor(blaiseApiClient: BlaiseApiClient, config: Config) {
        this.blaiseApiClient = blaiseApiClient;
        this.config = config;
        this.GetListOfInstruments = this.GetListOfInstruments.bind(this);
    }

    async GetListOfInstruments(req: Request, res: Response): Promise<Response> {
        try {
            let instruments = await getInstruments(this.blaiseApiClient, this.config)

            return res.status(200).json(instruments);
        } catch (error: any) {
          console.error(`Response: ${error}`);
          return res.status(500).json(`Failed to get instruments installed on server park ${this.config.ServerPark}`);
        }
    }
}