import express, { Request, Response, Router } from "express";
import BlaiseApiRestClient from "blaise-api-node-client";

export default function NewInstrumentListHandler(): Router {
    const router = express.Router();

    const instrumentHandler = new InstrumentListHandler();
    return router.get("/api/instruments", instrumentHandler.GetListOfInstruments);
}

export class InstrumentListHandler {
    blaiseApiRestClient: BlaiseApiRestClient;
    serverPark: string;

    constructor() {
        this.blaiseApiRestClient = new BlaiseApiRestClient("");
        this.serverPark = "gusty";
        this.GetListOfInstruments = this.GetListOfInstruments.bind(this);
    }

    async GetListOfInstruments(req: Request, res: Response): Promise<Response> {
        let instruments = await this.blaiseApiRestClient.getInstruments(this.serverPark)
        return res.status(200).json(instruments);
    }
}