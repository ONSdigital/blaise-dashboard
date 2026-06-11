export type GcpErrorLog = {
    timestamp: string;
    log: string;
};
export type CawiLoginCount = {
    timestamp: string;
    count: number;
};
export type ErrorLogScope = "blaise" | "non-blaise" | "nisra" | "bts" | "restapi";
export interface GoogleErrorLogging {
    getErrorLogsLast24Hours(scope: ErrorLogScope): Promise<GcpErrorLog[]>;
    getCawiSuccessfulLoginCountsLast24Hours(): Promise<CawiLoginCount[]>;
}
export declare class GoogleLoggingApi implements GoogleErrorLogging {
    readonly projectId: string;
    private readonly logging;
    constructor(projectId: string);
    getErrorLogsLast24Hours(scope: ErrorLogScope): Promise<GcpErrorLog[]>;
    getCawiSuccessfulLoginCountsLast24Hours(): Promise<CawiLoginCount[]>;
}
//# sourceMappingURL=googleLoggingApi.d.ts.map