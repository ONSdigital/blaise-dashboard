const dotenvConfigMock = vi.hoisted(() => vi.fn());

vi.mock("dotenv", () => ({
  default: {
    config: dotenvConfigMock,
  },
}));

import { getConfigFromEnv } from "./config.js";
import logger from "./logger.js";

describe("getConfigFromEnv", () => {
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

    const config = getConfigFromEnv();

    expect(dotenvConfigMock).toHaveBeenCalledTimes(1);
    expect(config).toEqual({
      BlaiseApiUrl: "http://localhost:8080",
      ServerPark: "gusty",
    });
  });

  it("does not load dotenv files in production and keeps protocol", () => {
    process.env.NODE_ENV = "production";
    process.env.BLAISE_API_URL = "https://blaise-api.local";
    process.env.SERVER_PARK = "gusty";

    const config = getConfigFromEnv();

    expect(dotenvConfigMock).not.toHaveBeenCalled();
    expect(config).toEqual({
      BlaiseApiUrl: "https://blaise-api.local",
      ServerPark: "gusty",
    });
  });

  it("throws when required env vars are missing", () => {
    process.env.NODE_ENV = "production";
    delete process.env.BLAISE_API_URL;
    delete process.env.SERVER_PARK;

    const loggerErrorSpy = vi
      .spyOn(logger, "error")
      .mockImplementation(() => logger);

    expect(() => getConfigFromEnv()).toThrow(
      "Missing required environment variables: BLAISE_API_URL, SERVER_PARK",
    );

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "BLAISE_API_URL environment variable has not been set",
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "SERVER_PARK environment variable has not been set",
    );
  });
});
