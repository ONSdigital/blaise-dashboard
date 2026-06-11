import express from "express";
import supertest from "supertest";
import errorLogsHandler, { ErrorLogsHandler } from "./errorLogsHandler.js";

describe("Error Logs Handler", () => {
  it("returns non-blaise logs by default", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi
        .fn()
        .mockResolvedValue([
          { timestamp: "2026-06-11T09:00:00.000Z", log: "Something failed" },
        ]),
      getCawiSuccessfulLoginCountsLast24Hours: vi.fn().mockResolvedValue([]),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get("/api/logs/errors", handler.GetErrorLogs);

    const response = await supertest(app).get("/api/logs/errors");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      { timestamp: "2026-06-11T09:00:00.000Z", log: "Something failed" },
    ]);
    expect(loggingApi.getErrorLogsLast24Hours).toHaveBeenCalledWith(
      "non-blaise",
    );
  });

  it("returns Blaise-only logs when scope=blaise", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi
        .fn()
        .mockResolvedValue([
          { timestamp: "2026-06-11T08:00:00.000Z", log: "Blaise failed" },
        ]),
      getCawiSuccessfulLoginCountsLast24Hours: vi.fn().mockResolvedValue([]),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get("/api/logs/errors", handler.GetErrorLogs);

    const response = await supertest(app)
      .get("/api/logs/errors")
      .query({ scope: "blaise" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      { timestamp: "2026-06-11T08:00:00.000Z", log: "Blaise failed" },
    ]);
    expect(loggingApi.getErrorLogsLast24Hours).toHaveBeenCalledWith("blaise");
  });

  it("returns NISRA logs when scope=nisra", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi
        .fn()
        .mockResolvedValue([
          { timestamp: "2026-06-11T08:30:00.000Z", log: "NISRA failed" },
        ]),
      getCawiSuccessfulLoginCountsLast24Hours: vi.fn().mockResolvedValue([]),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get("/api/logs/errors", handler.GetErrorLogs);

    const response = await supertest(app)
      .get("/api/logs/errors")
      .query({ scope: "nisra" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      { timestamp: "2026-06-11T08:30:00.000Z", log: "NISRA failed" },
    ]);
    expect(loggingApi.getErrorLogsLast24Hours).toHaveBeenCalledWith("nisra");
  });

  it("returns BTS logs when scope=bts", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi
        .fn()
        .mockResolvedValue([
          { timestamp: "2026-06-11T08:45:00.000Z", log: "BTS failed" },
        ]),
      getCawiSuccessfulLoginCountsLast24Hours: vi.fn().mockResolvedValue([]),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get("/api/logs/errors", handler.GetErrorLogs);

    const response = await supertest(app)
      .get("/api/logs/errors")
      .query({ scope: "bts" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      { timestamp: "2026-06-11T08:45:00.000Z", log: "BTS failed" },
    ]);
    expect(loggingApi.getErrorLogsLast24Hours).toHaveBeenCalledWith("bts");
  });

  it("returns REST API logs when scope=restapi", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi
        .fn()
        .mockResolvedValue([
          { timestamp: "2026-06-11T09:00:00.000Z", log: "REST API log" },
        ]),
      getCawiSuccessfulLoginCountsLast24Hours: vi.fn().mockResolvedValue([]),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get("/api/logs/errors", handler.GetErrorLogs);

    const response = await supertest(app)
      .get("/api/logs/errors")
      .query({ scope: "restapi" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      { timestamp: "2026-06-11T09:00:00.000Z", log: "REST API log" },
    ]);
    expect(loggingApi.getErrorLogsLast24Hours).toHaveBeenCalledWith("restapi");
  });

  it("returns 500 when provider throws", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi
        .fn()
        .mockRejectedValue(new Error("permission denied")),
      getCawiSuccessfulLoginCountsLast24Hours: vi.fn().mockResolvedValue([]),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get("/api/logs/errors", handler.GetErrorLogs);

    const response = await supertest(app).get("/api/logs/errors");

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual("Unable to get error logs");
  });

  it("returns 500 with string reason when provider rejects non-Error values", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi.fn().mockRejectedValue("permission denied"),
      getCawiSuccessfulLoginCountsLast24Hours: vi.fn().mockResolvedValue([]),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get("/api/logs/errors", handler.GetErrorLogs);

    const response = await supertest(app).get("/api/logs/errors");

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual("Unable to get error logs");
  });

  it("returns CAWI successful login counts", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi.fn().mockResolvedValue([]),
      getCawiSuccessfulLoginCountsLast24Hours: vi.fn().mockResolvedValue([
        { timestamp: "2026-06-11T12:00:00.000Z", count: 3 },
        { timestamp: "2026-06-11T13:00:00.000Z", count: 7 },
      ]),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get(
      "/api/logs/cawi-logins/success-counts",
      handler.GetCawiLoginSuccessCounts,
    );

    const response = await supertest(app).get(
      "/api/logs/cawi-logins/success-counts",
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      { timestamp: "2026-06-11T12:00:00.000Z", count: 3 },
      { timestamp: "2026-06-11T13:00:00.000Z", count: 7 },
    ]);
  });

  it("returns 500 when CAWI count provider throws", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi.fn().mockResolvedValue([]),
      getCawiSuccessfulLoginCountsLast24Hours: vi
        .fn()
        .mockRejectedValue(new Error("denied")),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get(
      "/api/logs/cawi-logins/success-counts",
      handler.GetCawiLoginSuccessCounts,
    );

    const response = await supertest(app).get(
      "/api/logs/cawi-logins/success-counts",
    );

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual("Unable to get CAWI successful login counts");
  });

  it("returns clear error when no project ID exists", async () => {
    const originalProjectId = process.env.PROJECT_ID;
    const originalGoogleProject = process.env.GOOGLE_CLOUD_PROJECT;
    const originalGcloudProject = process.env.GCLOUD_PROJECT;

    delete process.env.PROJECT_ID;
    delete process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;

    const app = express();
    app.use("/", errorLogsHandler());

    const errorResponse = await supertest(app).get("/api/logs/errors");
    const cawiResponse = await supertest(app).get(
      "/api/logs/cawi-logins/success-counts",
    );

    expect(errorResponse.statusCode).toEqual(500);
    expect(errorResponse.body).toEqual("Logging service is not configured");
    expect(cawiResponse.statusCode).toEqual(500);
    expect(cawiResponse.body).toEqual("Logging service is not configured");

    if (originalProjectId !== undefined) {
      process.env.PROJECT_ID = originalProjectId;
    }
    if (originalGoogleProject !== undefined) {
      process.env.GOOGLE_CLOUD_PROJECT = originalGoogleProject;
    }
    if (originalGcloudProject !== undefined) {
      process.env.GCLOUD_PROJECT = originalGcloudProject;
    }
  });

  it("returns 500 with string reason when CAWI provider rejects non-Error values", async () => {
    const loggingApi = {
      getErrorLogsLast24Hours: vi.fn().mockResolvedValue([]),
      getCawiSuccessfulLoginCountsLast24Hours: vi
        .fn()
        .mockRejectedValue("denied"),
    };

    const app = express();
    const handler = new ErrorLogsHandler(loggingApi);
    app.get(
      "/api/logs/cawi-logins/success-counts",
      handler.GetCawiLoginSuccessCounts,
    );

    const response = await supertest(app).get(
      "/api/logs/cawi-logins/success-counts",
    );

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual("Unable to get CAWI successful login counts");
  });
});
