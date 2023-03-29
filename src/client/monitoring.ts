import axios from "axios";
import { MonitoringDataModel } from "../server/monitoringDataModel";

export async function getMonitoring(): Promise<MonitoringDataModel[]> {
  const response = await axios.get("/api/monitoring");
  return response.data;
}
