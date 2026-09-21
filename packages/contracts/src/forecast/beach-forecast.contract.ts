import { z } from "zod";
import { currentWeatherSchema } from "./current-weather.contract.js";
import {
  forecastCoordinatesSchema,
  forecastHourSchema,
} from "./forecast-hour.contract.js";
import { forecastFreshnessSchema } from "./forecast-freshness.contract.js";
import { forecastSunTimesSchema } from "./forecast-sun-times.contract.js";

export const beachForecastSchema = z.object({
  beach: z.object({
    id: z.uuid(),
    slug: z.string().min(1),
    name: z.string().min(1),
    coordinates: forecastCoordinatesSchema,
  }),
  timezone: z.literal("UTC"),
  generatedAt: z.iso.datetime(),
  freshness: forecastFreshnessSchema,
  sunTimes: z.array(forecastSunTimesSchema).default([]),
  currentWeather: currentWeatherSchema.nullable().optional(),
  hourly: z.array(forecastHourSchema),
});

export type BeachForecast = z.infer<typeof beachForecastSchema>;
