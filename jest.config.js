module.exports = {
    "moduleNameMapper": {
        "\\.(css|less|scss)$": "identity-obj-proxy"
    }
};

process.env = Object.assign(process.env, {
    BLAISE_API_URL: "mock-api",
    SERVER_PARK: "server-park",
});