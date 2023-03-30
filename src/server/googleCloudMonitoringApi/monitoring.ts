import monitoring, { MetricServiceClient, UptimeCheckServiceClient } from "@google-cloud/monitoring";
import { MonitoringDataModel, Region} from "../monitoringDataModel";
import { google } from "@google-cloud/monitoring/build/protos/protos";

const uptimeclient = new monitoring.UptimeCheckServiceClient();
const metricsClient = new monitoring.MetricServiceClient();


const regionsMonitored : string [] = ["eur-belgium", "apac-singapore", "usa-oregon","sa-brazil-sao_paulo"];
//const projectId = "ons-blaise-v2-dev-sj01";


export async function getMonitoringUptimeCheckTimeSeries(
    projectId: string,
    regionsMonitored: string[]
): Promise<MonitoringDataModel[]> {

    try 
    {
        const request = {
            parent: uptimeclient.projectPath(projectId)
        };

        // Retrieves an uptime check config with hostnames-services like dqs, bus, bum, dashboard etc
        const [uptimeCheckConfigs] = await uptimeclient.listUptimeCheckConfigs(request);
        const monitoringDataResponse = uptimeCheckConfigs.map(fetchHostnames(projectId));
       
        return await Promise.all(monitoringDataResponse);
    } catch (error: any) {
        console.error(`Response: ${error}`);
        return [{"hostname":"bts","regions":[{"region":"europe", "status":"false"}]}];
    }
}

 var fetchHostnames = function getData(projectId: string){

    return async function(uptimeCheckConfig:google.monitoring.v3.IUptimeCheckConfig) 
    {
        const hostname = uptimeCheckConfig?.monitoredResource?.labels?.host!;
        const regions = regionsMonitored.map((region) => fetchTimeSeriesPoints(region, hostname, projectId));
        const monitoringDataObject : MonitoringDataModel = {
            hostname: hostname,
            regions: await Promise.all(regions)
        };
        return monitoringDataObject;
    };

};

 async function fetchTimeSeriesPoints ( regionMonitored : string, hostname : string, projectId: string) {
    //get timeSeries points
    try{
        const filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" resource.type=\"uptime_url\" resource.label.\"host\"=\"" + hostname + "\" metric.label.\"checker_location\"=\"" + regionMonitored+ "\"";
        const request = {
            name: metricsClient.projectPath(projectId),
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
        const [timeSeries] = await metricsClient.listTimeSeries(request);

        console.log("Status: for "+ hostname + " in region = "+ regionMonitored + " is " + JSON.stringify( timeSeries[0].points?.at(0)?.value?.boolValue));
        var region : Region = {
            region : regionMonitored,
            status :  timeSeries[0].points?.at(0)?.value?.boolValue == true ? "success" : "error" 
        };
        return region;
    }
    catch (error: any) {
        console.error(`Response: ${error}`);
        console.log("Failed to get timeSeries points data");
       var region : Region = {
        region : regionMonitored,
        status : "requestFailed"
        };
        return region;
    }
}
