import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getMonitoring } from "./monitoring";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

describe("getMonitoring tests", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  it("It should return uptime checks", async () => {
    mock.onGet("/api/monitoring").reply(200, []);
    const result = await getMonitoring();
    expect(result).toStrictEqual([]);
  });
});
