import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getCaseCompletionReport } from "./caseCompletionReport";

const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

describe("getCaseCompletionReport tests", () => {
  beforeAll(() => {
    vi.clearAllMocks();
    mock.reset();
  });

  it("It should return a caseCompletionReport", async () => {
    mock.onGet("/api/reports/cases/completions/dst2101a").reply(200, {
      Total: 1,
      Complete: 1,
      NotComplete: 0,
      CompletePercentage: 100,
    });

    const result = await getCaseCompletionReport("dst2101a");
    expect(result).toStrictEqual({
      Total: 1,
      Complete: 1,
      NotComplete: 0,
      CompletePercentage: 100,
    });
  });

  it("encodes questionnaire names used in request URLs", async () => {
    mock.onGet("/api/reports/cases/completions/OPN%202101A%2F1").reply(200, {
      Total: 2,
      Complete: 1,
      NotComplete: 1,
      CompletePercentage: 50,
    });

    const result = await getCaseCompletionReport("OPN 2101A/1");

    expect(result).toStrictEqual({
      Total: 2,
      Complete: 1,
      NotComplete: 1,
      CompletePercentage: 50,
    });
  });
});
