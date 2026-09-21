import { z } from "zod";
import { forecastHourSchema } from "./forecast-hour.contract.js";

export const currentWeatherSchema = forecastHourSchema.shape.weather
  .omit({ precipitationProbabilityPercent: true })
  .extend({
    time: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
    intervalSeconds: z.number().int().positive(),
    weatherCode: z.number().int().min(0).max(99).nullable(),
    isDay: z.boolean().nullable(),
  });

export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
