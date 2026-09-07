import { z } from "zod";

export const forecastDaysSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export type ForecastDays = z.infer<typeof forecastDaysSchema>;
