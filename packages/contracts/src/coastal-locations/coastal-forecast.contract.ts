import { z } from "zod";
import { forecastHourSchema } from "../forecast/forecast-hour.contract.js";
import { forecastFreshnessSchema } from "../forecast/forecast-freshness.contract.js";
import { forecastSunTimesSchema } from "../forecast/forecast-sun-times.contract.js";
import { coastalLocationSchema } from "./coastal-location.contract.js";

export const coastalForecastSchema = z.object({
  location: coastalLocationSchema,
  timezone: z.literal("UTC"),
  generatedAt: z.iso.datetime(),
  freshness: forecastFreshnessSchema,
  sunTimes: z.array(forecastSunTimesSchema).default([]),
  hourly: z.array(forecastHourSchema),
});

export type CoastalForecast = z.infer<typeof coastalForecastSchema>;
