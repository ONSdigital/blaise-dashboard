import express, { Request, Response, Router } from "express";
import { BlaiseApiClient, Diagnostic } from "blaise-api-node-client";

type DqsBlaiseStatus = {
    "health check type": string;
    status: string;
};

export default function BlaiseStatusHandler(blaiseApiClient: BlaiseApiClient): Router {
    const router = express.Router();

    return router.get("/api/health", (req: Request, res: Response) => getBlaiseStatus(req, res, blaiseApiClient));
}

function mapDiagnosticsToDqsStatus(diagnostics: readonly Diagnostic[]): DqsBlaiseStatus[] {
    return diagnostics.map((diagnostic) => ({
        "health check type": diagnostic.healthCheckType,
        status: diagnostic.status
    }));
}

export async function getBlaiseStatus(_req: Request, res: Response, blaiseApiClient: BlaiseApiClient): Promise<Response> {
    try {
        const diagnostics = await blaiseApiClient.getDiagnostics();
        return res.status(200).json(mapDiagnosticsToDqsStatus(diagnostics));
    } catch (error: unknown) {
        console.error("Failed to retrieve Blaise status", error);
        return res.status(500).json({ message: "Unable to get Blaise status" });
    }
}