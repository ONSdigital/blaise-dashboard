import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getBlaiseStatus } from "./blaiseStatus";

describe("Blaise Status API", () => {
    const mockAdapter = new MockAdapter(axios);

    it("returns a list of health checks", async () => {
        const statusList = [
            { "health check type": "Connection model", status: "OK" },
            { "health check type": "Blaise connection", status: "OK" }
        ];

        mockAdapter.onGet("/api/health").reply(200, statusList);

        const response = await getBlaiseStatus();

        expect(response).toEqual(statusList);
    });
});