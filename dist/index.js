"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const server_1 = __importDefault(require("./server"));
const node_cache_1 = __importDefault(require("node-cache"));
function loadEsmModule(specifier) {
    const dynamicImport = new Function("s", "return import(s)");
    return dynamicImport(specifier);
}
async function bootstrap() {
    const cacheDuration = 60; // 60 seconds
    const port = process.env.PORT || "5000";
    const config = (0, config_1.GetConfigFromEnv)();
    const { BlaiseApiClient } = await loadEsmModule("blaise-api-node-client");
    const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);
    const cache = new node_cache_1.default({ stdTTL: cacheDuration });
    const app = (0, server_1.default)(blaiseApiClient, cache, config);
    app.listen(port);
    console.log("App is listening on port " + port);
}
bootstrap().catch((error) => {
    console.error("Failed to start app", error);
    process.exit(1);
});
