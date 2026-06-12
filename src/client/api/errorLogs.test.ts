import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { getErrorLogs } from "./errorLogs";

describe("Error Logs API", () => {
  const mockAdapter = new MockAdapter(axios);

  afterEach(() => {
    mockAdapter.reset();
  });

  it("returns logs list", async () => {
    const logs = [
      { timestamp: "2026-06-11T10:00:00.000Z", log: "Failure one" },
    ];

    mockAdapter
      .onGet("/api/logs/errors", { params: { scope: "non-blaise" } })
      .reply(200, logs);

    const response = await getErrorLogs();

    expect(response).toEqual(logs);
  });

  it("supports Blaise-only scope", async () => {
    const logs = [
      { timestamp: "2026-06-11T11:00:00.000Z", log: "Blaise failure" },
    ];

    mockAdapter
      .onGet("/api/logs/errors", { params: { scope: "blaise" } })
      .reply(200, logs);

    const response = await getErrorLogs("blaise");

    expect(response).toEqual(logs);
  });

  it("supports NISRA scope", async () => {
    const logs = [
      { timestamp: "2026-06-11T12:00:00.000Z", log: "NISRA failure" },
    ];

    mockAdapter
      .onGet("/api/logs/errors", { params: { scope: "nisra" } })
      .reply(200, logs);

    const response = await getErrorLogs("nisra");

    expect(response).toEqual(logs);
  });

  it("supports BTS scope", async () => {
    const logs = [
      { timestamp: "2026-06-11T13:00:00.000Z", log: "BTS failure" },
    ];

    mockAdapter
      .onGet("/api/logs/errors", { params: { scope: "bts" } })
      .reply(200, logs);

    const response = await getErrorLogs("bts");

    expect(response).toEqual(logs);
  });

  it("supports REST API scope", async () => {
    const logs = [
      { timestamp: "2026-06-11T14:00:00.000Z", log: "REST API log" },
    ];

    mockAdapter
      .onGet("/api/logs/errors", { params: { scope: "restapi" } })
      .reply(200, logs);

    const response = await getErrorLogs("restapi");

    expect(response).toEqual(logs);
  });
});
