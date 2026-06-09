import type { BlaiseApiClient } from "blaise-api-node-client";
import { GetConfigFromEnv } from "./config";
import NewServer from "./server";
import NodeCache from "node-cache";

type BlaiseApiModule = {
	BlaiseApiClient: new (baseUrl: string) => BlaiseApiClient;
};

function loadEsmModule<T>(specifier: string): Promise<T> {
	const dynamicImport = new Function("s", "return import(s)") as (s: string) => Promise<T>;
	return dynamicImport(specifier);
}

async function bootstrap(): Promise<void> {
	const cacheDuration = 60; // 60 seconds
	const port: string = process.env.PORT || "5000";
	const config = GetConfigFromEnv();
	const { BlaiseApiClient } = await loadEsmModule<BlaiseApiModule>("blaise-api-node-client");
	const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);
	const cache = new NodeCache({ stdTTL: cacheDuration });
	const app = NewServer(blaiseApiClient, cache, config);

	app.listen(port);

	console.log("App is listening on port " + port);
}

bootstrap().catch((error: unknown) => {
	console.error("Failed to start app", error);
	process.exit(1);
});
