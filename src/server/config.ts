import dotenv from "dotenv";
export interface Config {
    BlaiseApiUrl: string,
    ServerPark: string
}

export function GetConfigFromEnv(): Config {
    if (process.env.NODE_ENV !== "production") {
        dotenv.config({ path: __dirname + "/../.env" });
    }

    let { BLAISE_API_URL, SERVER_PARK} = process.env;

    if (BLAISE_API_URL === undefined) {
        console.error("BLAISE_API_URL environment variable has not been set");
        BLAISE_API_URL = "ENV_VAR_NOT_SET";
    }

    if (SERVER_PARK === undefined) {
        console.error("SERVER_PARK environment variable has not been set");
        SERVER_PARK = "ENV_VAR_NOT_SET";
    }

    return {
        BlaiseApiUrl: BLAISE_API_URL,
        ServerPark: SERVER_PARK
    };
}
