import express, { Request, Response, Router } from "express";
import { BlaiseApiClient, Diagnostic } from "blaise-api-node-client";
import logger from "../logger.js";

type DqsBlaiseStatus = {
  "health check type": string;
  status: string;
};

const defaultHealthCheckTypes = [
  "Connection model",
  "Blaise connection",
  "Remote data server connection",
  "Remote Cati management connection",
];

export default function blaiseStatusHandler(
  blaiseApiClient: BlaiseApiClient,
): Router {
  const router = express.Router();

  return router.get("/api/health", (req: Request, res: Response) =>
    getBlaiseStatus(req, res, blaiseApiClient),
  );
}

function mapDiagnosticsToDqsStatus(
  diagnostics: readonly Diagnostic[],
): DqsBlaiseStatus[] {
  return diagnostics.map((diagnostic, index: number) => {
    const healthCheckTypeFromDiagnostic = diagnostic as unknown as Record<
      string,
      unknown
    >;
    const directHealthCheckType =
      healthCheckTypeFromDiagnostic["health check type"];
    const camelCaseHealthCheckType =
      healthCheckTypeFromDiagnostic.healthCheckType;
    const derivedHealthCheckType = Object.entries(
      healthCheckTypeFromDiagnostic,
    ).find(([key, value]) => {
      const normalizedKey = key.replace(/[^a-z]/gi, "").toLowerCase();
      return (
        normalizedKey.includes("healthchecktype") &&
        typeof value === "string" &&
        value.trim().length > 0
      );
    })?.[1];
    const fallbackHealthCheckType =
      index < defaultHealthCheckTypes.length
        ? defaultHealthCheckTypes[index]
        : "Unknown health check";

    const status =
      typeof diagnostic.status === "string" &&
      diagnostic.status.trim().length > 0
        ? diagnostic.status
        : "Unknown";

    return {
      "health check type":
        (typeof directHealthCheckType === "string" &&
          directHealthCheckType.trim().length > 0 &&
          directHealthCheckType) ||
        (typeof camelCaseHealthCheckType === "string" &&
          camelCaseHealthCheckType.trim().length > 0 &&
          camelCaseHealthCheckType) ||
        (typeof derivedHealthCheckType === "string" &&
          derivedHealthCheckType) ||
        fallbackHealthCheckType,
      status,
    };
  });
}

export async function getBlaiseStatus(
  _req: Request,
  res: Response,
  blaiseApiClient: BlaiseApiClient,
): Promise<Response> {
  try {
    const diagnostics = await blaiseApiClient.getDiagnostics();
    return res.status(200).json(mapDiagnosticsToDqsStatus(diagnostics));
  } catch (error: unknown) {
    logger.error({ error }, "Failed to retrieve Blaise status");
    return res.status(500).json({ message: "Unable to get Blaise status" });
  }
}
