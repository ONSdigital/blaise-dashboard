import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getInstruments } from "./instruments";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

describe("getInstruments tests", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  it("It should return instruments", async () => {
    mock.onGet("/api/instruments").reply(200, []);

    const result = await getInstruments();
    expect(result).toStrictEqual([]);
  });
});
