import NewServer from "../server";
import supertest from "supertest";

const server = NewServer();
const request = supertest(server);

describe("Test Heath Endpoint", () => {
    it("should return a 200 status and json message", async () => {
        const response = await request.get("/dashboard-ui/version/health");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toStrictEqual({healthy: true});
    });
});