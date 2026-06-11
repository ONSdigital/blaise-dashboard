import dotenv from "dotenv";
import path from "path";
import logger from "./logger.js";
export interface Config {
  BlaiseApiUrl: string;
  ServerPark: string;
}

export function GetConfigFromEnv(): Config {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  }

  const { BLAISE_API_URL, SERVER_PARK } = process.env;
  const missingVariables: string[] = [];

  if (BLAISE_API_URL === undefined || BLAISE_API_URL.trim().length === 0) {
    logger.error("BLAISE_API_URL environment variable has not been set");
    missingVariables.push("BLAISE_API_URL");
  }

  if (SERVER_PARK === undefined || SERVER_PARK.trim().length === 0) {
    logger.error("SERVER_PARK environment variable has not been set");
    missingVariables.push("SERVER_PARK");
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );
  }

  return {
    BlaiseApiUrl: fixProtocol(BLAISE_API_URL!),
    ServerPark: SERVER_PARK!,
  };
}

function fixProtocol(blaiseApiUrl: string): string {
  if (!blaiseApiUrl.includes("://")) {
    blaiseApiUrl = `http://${blaiseApiUrl}`;
  }
  return blaiseApiUrl;
}
