import axios from "axios";

export type ErrorLogScope = "blaise" | "non-blaise" | "nisra" | "bts" | "restapi";

export type GcpErrorLog = {
    timestamp: string;
    log: string;
};

export async function getErrorLogs(scope: ErrorLogScope = "non-blaise"): Promise<GcpErrorLog[]> {
    const response = await axios.get("/api/logs/errors", { params: { scope } });
    return response.data;
}