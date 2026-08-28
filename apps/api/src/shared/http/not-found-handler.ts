import type { RequestHandler } from "express";

import { HttpError } from "./http-error.js";

export const notFoundHandler: RequestHandler = (_request, _response, next) => {
  next(
    new HttpError({
      status: 404,
      code: "API_ROUTE_NOT_FOUND",
      message: "Маршрут API не найден",
    }),
  );
};
