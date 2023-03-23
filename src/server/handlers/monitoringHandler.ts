import express, { Request, Response, Router } from "express";
import monitoring from "@google-cloud/monitoring";
import { MonitoringDataModel } from "../monitoringDataModel";
import { Region } from "../monitoringDataModel";

export default function NewMonitoringListHandler(): Router {
    const router = express.Router();

    const monitoringHandler = new MonitoringHandler();
    return router.get("/api/monitoring", monitoringHandler.GetMonitoringData);
}
 
const regionsMonitored : string [] = ["eur-belgium", "apac-singapore", "usa-oregon","sa-brazil-sao_paulo"];

export class MonitoringHandler {
    

    constructor() {
        this.GetMonitoringData = this.GetMonitoringData.bind(this);
    }

    async GetMonitoringData(req: Request, res: Response): Promise<Response> {
        
    const projectId = "ons-blaise-v2-dev-sj01";
        
       try {
            const client = new monitoring.UptimeCheckServiceClient();

            const request = {
                parent: client.projectPath(projectId)
            };

            // Retrieves an uptime check config
            const [uptimeCheckConfigs] = await client.listUptimeCheckConfigs(request);

            const monitoringDataResponse = uptimeCheckConfigs.map(async(uptimeCheckConfig) => {
                const hostname = uptimeCheckConfig?.monitoredResource?.labels?.host!;
                const regions = regionsMonitored.map(async (regionMonitored) => {
                    
                    //get timeSeries points
                    try{
                        const client = new monitoring.MetricServiceClient();

                        const filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" resource.type=\"uptime_url\" resource.label.\"host\"=\"" + hostname +"\" metric.label.\"checker_location\"=\"" +regionMonitored+ "\"";
                        const request = {
                            name: client.projectPath(projectId),
                            filter: filter,
                            interval: {
                                startTime: {
                                    // Limit results to the last 1 minutes
                                    seconds: Date.now() / 1000 - 60 * 1/2,
                                },
                                endTime: {
                                    seconds: Date.now() / 1000,
                                }
                            }
                        };
            
                        // Writes time series data
                        const [timeSeries] = await client.listTimeSeries(request);

                        console.log("Status: "+ JSON.stringify( timeSeries[0].points?.at(0)?.value?.boolValue));
                        var region : Region = {
                            region : regionMonitored,
                            status :  timeSeries[0].points?.at(0)?.value?.boolValue == true ? "success" : "error" 
                        };
                        return region;
                    
                    }
                
                    catch (error: any) {
                        console.error(`Response: ${error}`);
                       //return `Failed to get timeSeries points data`;
                       var region : Region = {
                        region : regionMonitored,
                        status : "info"
                    };
                    return region;
                    }

                });
                const monitoringDataObject : MonitoringDataModel = {
                    hostname: hostname,
                    regions: await Promise.all(regions)
                };
                return monitoringDataObject;

            });
           return res.status(200).json(await Promise.all(monitoringDataResponse));
        } catch (error: any) {
            console.error(`Response: ${error}`);
            return res.status(200).json("Failed to get monitoring uptimeChecks config data");
        }


    }// Function end


}//Class end
