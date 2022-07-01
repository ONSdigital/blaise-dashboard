import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getQuestionnaires } from "./questionnaires";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

describe("getQuestionnaires tests", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  it("It should return questionnaires", async () => {
    mock.onGet("/api/questionnaires").reply(200, []);

    const result = await getQuestionnaires();
    expect(result).toStrictEqual([]);
  });
});
