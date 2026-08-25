import { z } from "zod";
import {
  forecastCoordinatesSchema,
  forecastHourSchema,
} from "./forecast-hour.contract.js";

export const beachForecastSchema = z.object({
  beach: z.object({
    id: z.uuid(),
    slug: z.string().min(1),
    name: z.string().min(1),
    coordinates: forecastCoordinatesSchema,
  }),
  timezone: z.literal("UTC"),
  generatedAt: z.iso.datetime(),
  hourly: z.array(forecastHourSchema),
});

export type BeachForecast = z.infer<typeof beachForecastSchema>;
