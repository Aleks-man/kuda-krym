import { z } from "zod";
import { forecastCoordinatesSchema, forecastHourSchema } from "../forecast/forecast-hour.contract.js";
import { forecastFreshnessSchema } from "../forecast/forecast-freshness.contract.js";

export const cityForecastSchema = z.object({
  city: z.object({
    slug: z.string().min(1),
    name: z.string().min(1),
    coordinates: forecastCoordinatesSchema,
  }),
  timezone: z.literal("UTC"),
  generatedAt: z.iso.datetime(),
  freshness: forecastFreshnessSchema,
  hourly: z.array(forecastHourSchema),
});

export type CityForecast = z.infer<typeof cityForecastSchema>;
