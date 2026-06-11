const dotenvConfigMock = vi.hoisted(() => vi.fn());

vi.mock("dotenv", () => ({
    default: {
        config: dotenvConfigMock
    }
}));

import { GetConfigFromEnv } from "./config.js";

describe("GetConfigFromEnv", () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = { ...originalEnv };
        vi.restoreAllMocks();
        dotenvConfigMock.mockReset();
    });

    it("loads env files in non-production and fixes missing protocol", () => {
        process.env.NODE_ENV = "development";
        process.env.BLAISE_API_URL = "localhost:8080";
        process.env.SERVER_PARK = "gusty";

        const config = GetConfigFromEnv();

        expect(dotenvConfigMock).toHaveBeenCalledTimes(2);
        expect(config).toEqual({
            BlaiseApiUrl: "http://localhost:8080",
            ServerPark: "gusty"
        });
    });

    it("does not load dotenv files in production and keeps protocol", () => {
        process.env.NODE_ENV = "production";
        process.env.BLAISE_API_URL = "https://blaise-api.local";
        process.env.SERVER_PARK = "gusty";

        const config = GetConfigFromEnv();

        expect(dotenvConfigMock).not.toHaveBeenCalled();
        expect(config).toEqual({
            BlaiseApiUrl: "https://blaise-api.local",
            ServerPark: "gusty"
        });
    });

    it("uses fallback values when env vars are missing", () => {
        process.env.NODE_ENV = "production";
        delete process.env.BLAISE_API_URL;
        delete process.env.SERVER_PARK;

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const config = GetConfigFromEnv();

        expect(consoleErrorSpy).toHaveBeenCalledWith("BLAISE_API_URL environment variable has not been set");
        expect(consoleErrorSpy).toHaveBeenCalledWith("SERVER_PARK environment variable has not been set");
        expect(config).toEqual({
            BlaiseApiUrl: "http://ENV_VAR_NOT_SET",
            ServerPark: "ENV_VAR_NOT_SET"
        });
    });
});
