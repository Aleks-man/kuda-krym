import { z } from "zod";

export const forecastSunTimesSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sunrise: z.string().min(1),
  sunset: z.string().min(1),
});

export type ForecastSunTimes = z.infer<typeof forecastSunTimesSchema>;
