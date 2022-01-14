import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "./config";
import NewServer from "./server";

const port: string = process.env.PORT || "5000";
const config = GetConfigFromEnv();
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);
const app = NewServer(blaiseApiClient, config);

app.listen(port);

console.log("App is listening on port " + port);