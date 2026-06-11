export type MonitoringDataModel = {
    hostname: string;
    regions: Region[];
};
export type Region = {
    region: string;
    status: string;
};
export type UptimeCheck = {
    hostname: string;
    eurBelgium: string;
    apacSingapore: string;
    northAmerica: string;
    southAmerica: string;
};
export declare const monitoringDataModelModuleLoaded = true;
//# sourceMappingURL=monitoringDataModel.d.ts.map