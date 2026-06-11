import type { BlaiseApiClient } from "blaise-api-node-client";
import { GetConfigFromEnv } from "./config.js";
import NewServer from "./server.js";
import NodeCache from "node-cache";

type BlaiseApiModule = {
	BlaiseApiClient: new (baseUrl: string) => BlaiseApiClient;
};

function loadEsmModule<T>(specifier: string): Promise<T> {
	return import(specifier) as Promise<T>;
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

async function startApp(): Promise<void> {
	try {
		await bootstrap();
	} catch (error: unknown) {
		console.error("Failed to start app", error);
		process.exit(1);
	}
}

async function maybeAutoStart(): Promise<void> {
	if (process.env["NODE_ENV"] !== "test") {
		await startApp();
	}
}

export { loadEsmModule, bootstrap, startApp, maybeAutoStart };

void maybeAutoStart();
