export type MonitoringDataModel = {
    hostname: string;
    regions: Region[];
};

type Region = {
    region: string;
    status: string;
};

export const monitoringDataModelTypeModuleLoaded = true;