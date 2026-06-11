"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEsmModule = loadEsmModule;
exports.bootstrap = bootstrap;
exports.startApp = startApp;
exports.maybeAutoStart = maybeAutoStart;
const config_1 = require("./config");
const server_1 = __importDefault(require("./server"));
const node_cache_1 = __importDefault(require("node-cache"));
function loadEsmModule(specifier) {
    return Promise.resolve(`${specifier}`).then(s => __importStar(require(s)));
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
async function startApp() {
    try {
        await bootstrap();
    }
    catch (error) {
        console.error("Failed to start app", error);
        process.exit(1);
    }
}
async function maybeAutoStart() {
    if (process.env["NODE_ENV"] !== "test") {
        await startApp();
    }
}
void maybeAutoStart();
//# sourceMappingURL=index.js.map