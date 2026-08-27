import { z } from "zod";

export const forecastFreshnessStatusSchema = z.enum(["FRESH", "STALE"]);

export const forecastSourceFreshnessSchema = z.object({
  status: forecastFreshnessStatusSchema,
  generatedAt: z.iso.datetime(),
});

export const forecastFreshnessSchema = z.object({
  status: forecastFreshnessStatusSchema,
  sources: z.object({
    weather: forecastSourceFreshnessSchema,
    marine: forecastSourceFreshnessSchema,
    weatherModels: forecastSourceFreshnessSchema.nullable(),
  }),
});

export type ForecastFreshnessStatus = z.infer<
  typeof forecastFreshnessStatusSchema
>;
export type ForecastSourceFreshness = z.infer<
  typeof forecastSourceFreshnessSchema
>;
export type ForecastFreshness = z.infer<typeof forecastFreshnessSchema>;
