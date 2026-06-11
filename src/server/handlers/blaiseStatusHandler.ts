import express, { Request, Response, Router } from "express";
import axios from "axios";
import { Config } from "../config";

export default function BlaiseStatusHandler(config: Config): Router {
    const router = express.Router();

    return router.get("/api/health", (req: Request, res: Response) => getBlaiseStatus(req, res, config));
}

export async function getBlaiseStatus(_req: Request, res: Response, config: Config): Promise<Response> {
    try {
        const response = await axios.get(`${config.BlaiseApiUrl}/api/v1/health`);
        return res.status(response.status).json(response.data);
    } catch (error: unknown) {
        console.error("Failed to retrieve Blaise status", error);

        if (axios.isAxiosError(error) && error.response !== undefined) {
            return res.status(error.response.status).json(error.response.data);
        }

        return res.status(500).json({ message: "Unable to get Blaise status" });
    }
}