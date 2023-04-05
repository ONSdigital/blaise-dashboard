module.exports = {
    "moduleNameMapper": {
        "\\.(css|less|scss)$": "identity-obj-proxy"
    },
    setupFilesAfterEnv: ["<rootDir>/jest-setup.js"]
};

process.env = Object.assign(process.env, {
    BLAISE_API_URL: "mock-api",
    SERVER_PARK: "server-park",
});