import BlaiseApiClient from "blaise-api-node-client";
import { GetConfigFromEnv } from "./config";
import NewServer from "./server";
import NodeCache from "node-cache";
import { cacheDuration } from "../client/refreshInterval";

const port: string = process.env.PORT || "5000";
const config = GetConfigFromEnv();
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);
const cache = new NodeCache({ stdTTL: cacheDuration });
const app = NewServer(blaiseApiClient, cache, config);

app.listen(port);

console.log("App is listening on port " + port);
