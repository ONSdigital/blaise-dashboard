import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getCawiLoginSuccessCounts } from "./cawiLoginCounts";

describe("CAWI login counts API", () => {
    const mockAdapter = new MockAdapter(axios);

    afterEach(() => {
        mockAdapter.reset();
    });

    it("returns successful login counts", async () => {
        const points = [
            { timestamp: "2026-06-11T12:00:00.000Z", count: 3 }
        ];

        mockAdapter.onGet("/api/logs/cawi-logins/success-counts").reply(200, points);

        const response = await getCawiLoginSuccessCounts();

        expect(response).toEqual(points);
    });
});
