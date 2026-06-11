"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConfigFromEnv = GetConfigFromEnv;
const dotenv_1 = __importDefault(require("dotenv"));
function GetConfigFromEnv() {
    if (process.env.NODE_ENV !== "production") {
        dotenv_1.default.config({ path: __dirname + "/../.env" });
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
