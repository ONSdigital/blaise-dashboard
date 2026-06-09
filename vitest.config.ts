import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "blaise-api-node-client": fileURLToPath(new URL("./src/test/mocks/blaiseApiNodeClientMock.ts", import.meta.url))
        }
    },
    test: {
        projects: [
            {
                test: {
                    name: "client",
                    globals: true,
                    clearMocks: true,
                    environment: "happy-dom",
                    setupFiles: ["./src/test/setupTests.ts"],
                    include: ["src/**/*.test.tsx", "src/client/**/*.test.ts"]
                }
            },
            {
                test: {
                    name: "server",
                    globals: true,
                    clearMocks: true,
                    environment: "node",
                    setupFiles: ["./src/test/setupTests.ts"],
                    include: ["src/server/**/*.test.ts"]
                }
            }
        ],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.test.{ts,tsx}", "src/**/__snapshots__/**", "src/test/**"]
        }
    }
});
