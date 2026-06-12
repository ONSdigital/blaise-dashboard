export type MonitoringDataModel = {
  hostname: string;
  regions: Region[];
};

export type Region = {
  region: string;
  status: string;
};

export const monitoringDataModelModuleLoaded = true;
