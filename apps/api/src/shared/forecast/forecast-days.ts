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

// Seven Crimea calendar days can span eight UTC dates before UTC midnight.
// Public forecast endpoints still validate their seven-day limit above.
export const providerForecastDaysSchema = z.union([forecastDaysSchema, z.literal(8)]);

export type ForecastDays = z.infer<typeof providerForecastDaysSchema>;
