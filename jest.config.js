module.exports = {
    "moduleNameMapper": {
        "\\.(css|less|scss)$": "identity-obj-proxy",
        "^blaise-api-node-client$": "<rootDir>/src/test/mocks/blaiseApiNodeClientMock.ts"
    },
    setupFilesAfterEnv: ["<rootDir>/jest-setup.js"]
};

process.env = Object.assign(process.env, {
    BLAISE_API_URL: "mock-api",
    SERVER_PARK: "server-park",
});