"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConfigFromEnv = GetConfigFromEnv;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
function GetConfigFromEnv() {
    if (process.env.NODE_ENV !== "production") {
        // Support both historical root .env and newer src/.env local layouts.
        dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), "src/.env") });
        dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
    }
    let { BLAISE_API_URL, SERVER_PARK } = process.env;
    if (BLAISE_API_URL === undefined) {
        console.error("BLAISE_API_URL environment variable has not been set");
        BLAISE_API_URL = "ENV_VAR_NOT_SET";
    }
    if (SERVER_PARK === undefined) {
        console.error("SERVER_PARK environment variable has not been set");
        SERVER_PARK = "ENV_VAR_NOT_SET";
    }
    return {
        BlaiseApiUrl: fixProtocol(BLAISE_API_URL),
        ServerPark: SERVER_PARK
    };
}
function fixProtocol(blaiseApiUrl) {
    if (!blaiseApiUrl.includes("://")) {
        blaiseApiUrl = `http://${blaiseApiUrl}`;
    }
    return blaiseApiUrl;
}
//# sourceMappingURL=config.js.map