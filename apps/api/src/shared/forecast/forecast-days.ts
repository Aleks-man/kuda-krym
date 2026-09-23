import { z } from "zod";

export const forecastDaysSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
]);

export type ForecastDays = z.infer<typeof forecastDaysSchema>;
