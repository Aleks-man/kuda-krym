import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { createErrorHandler } from "../../../src/shared/http/error-handler.js";
import { HttpError } from "../../../src/shared/http/http-error.js";
import { notFoundHandler } from "../../../src/shared/http/not-found-handler.js";

describe("API error handling", () => {
  it("serializes an expected HTTP error", async () => {
    const app = express();
    app.get("/expected", () => {
      throw new HttpError({
        status: 409,
        code: "EXPECTED_ERROR",
        message: "Ожидаемая ошибка",
      });
    });
    app.use(createErrorHandler());

    const response = await request(app).get("/expected");

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: { code: "EXPECTED_ERROR", message: "Ожидаемая ошибка" },
    });
  });

  it("hides and reports an unexpected error", async () => {
    const onUnexpectedError = vi.fn();
    const internalError = new Error("Database password leaked");
    const app = express();
    app.get("/unexpected", () => {
      throw internalError;
    });
    app.use(createErrorHandler({ onUnexpectedError }));

    const response = await request(app).get("/unexpected");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Внутренняя ошибка сервера",
      },
    });
    expect(onUnexpectedError).toHaveBeenCalledWith(internalError);
  });

  it("returns a structured error for an unknown API route", async () => {
    const app = express();
    app.use(notFoundHandler);
    app.use(createErrorHandler());

    const response = await request(app).get("/missing");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: "API_ROUTE_NOT_FOUND",
        message: "Маршрут API не найден",
      },
    });
  });
});
