import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getMonitoring } from "./monitoring";

const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

describe("getMonitoring tests", () => {
  beforeAll(() => {
    vi.clearAllMocks();
    mock.reset();
  });

  it("It should return uptime checks", async () => {
    mock.onGet("/api/monitoring").reply(200, []);
    const result = await getMonitoring();
    expect(result).toStrictEqual([]);
  });
});
