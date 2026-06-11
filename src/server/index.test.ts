describe("server bootstrap", () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = { ...originalEnv };
        vi.resetModules();
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    it("boots server and starts listening", async () => {
        const listenMock = vi.fn();
        const newServerMock = vi.fn(() => ({ listen: listenMock }));
        const nodeCacheMock = vi.fn().mockImplementation(function MockNodeCache() {
            return {};
        });

        vi.doMock("./config", () => ({
            GetConfigFromEnv: () => ({ BlaiseApiUrl: "http://blaise-api.local", ServerPark: "gusty" })
        }));
        vi.doMock("./server", () => ({
            default: newServerMock
        }));
        vi.doMock("node-cache", () => ({
            default: nodeCacheMock
        }));

        vi.doMock("blaise-api-node-client", () => ({
            BlaiseApiClient: class MockBlaiseApiClient {
                constructor() {
                    // no-op
                }
            }
        }));

        process.env.PORT = "7777";
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

        const { startApp } = await import("./index.js");
        await startApp();

        expect(nodeCacheMock).toHaveBeenCalledWith({ stdTTL: 60 });
        expect(newServerMock).toHaveBeenCalledTimes(1);
        expect(listenMock).toHaveBeenCalledWith("7777");
        expect(logSpy).toHaveBeenCalledWith("App is listening on port 7777");
    });

    it("logs and exits when bootstrap fails", async () => {
        const nodeCacheMock = vi.fn().mockImplementation(function MockNodeCache() {
            return {};
        });

        vi.doMock("./config", () => ({
            GetConfigFromEnv: () => ({ BlaiseApiUrl: "http://blaise-api.local", ServerPark: "gusty" })
        }));
        vi.doMock("./server", () => ({
            default: vi.fn(() => {
                throw new Error("boom");
            })
        }));
        vi.doMock("node-cache", () => ({
            default: nodeCacheMock
        }));
        vi.doMock("blaise-api-node-client", () => ({
            BlaiseApiClient: class MockBlaiseApiClient {
                constructor() {
                    // no-op
                }
            }
        }));

        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

        const { startApp } = await import("./index.js");
        await startApp();

        expect(errorSpy).toHaveBeenCalledWith("Failed to start app", expect.any(Error));
        expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it("auto-starts on module import when NODE_ENV is not test", async () => {
        vi.doMock("./config", () => ({
            GetConfigFromEnv: () => ({ BlaiseApiUrl: "http://blaise-api.local", ServerPark: "gusty" })
        }));
        vi.doMock("./server", () => ({
            default: vi.fn(() => ({ listen: vi.fn() }))
        }));
        vi.doMock("node-cache", () => ({
            default: vi.fn().mockImplementation(function MockNodeCache() {
                return {};
            })
        }));
        vi.doMock("blaise-api-node-client", () => ({
            BlaiseApiClient: class MockBlaiseApiClient {
                constructor() {
                    // no-op
                }
            }
        }));

        process.env.NODE_ENV = "development";
        process.env.PORT = "7788";
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

        const { maybeAutoStart } = await import("./index.js");
        await maybeAutoStart();

        expect(logSpy).toHaveBeenCalledWith("App is listening on port 7788");
    });
});
