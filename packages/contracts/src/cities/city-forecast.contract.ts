import { z } from "zod";
import { currentWeatherSchema } from "../forecast/current-weather.contract.js";
import { forecastCoordinatesSchema, forecastHourSchema } from "../forecast/forecast-hour.contract.js";
import { forecastFreshnessSchema } from "../forecast/forecast-freshness.contract.js";
import { forecastSunTimesSchema } from "../forecast/forecast-sun-times.contract.js";

export const cityForecastSchema = z.object({
  city: z.object({
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

export type CityForecast = z.infer<typeof cityForecastSchema>;
