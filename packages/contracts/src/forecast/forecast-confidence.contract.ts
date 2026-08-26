import { z } from "zod";

export const forecastConfidenceFactorSchema = z.object({
  name: z.enum([
    "FRESHNESS",
    "HORIZON",
    "COMPLETENESS",
    "MODEL_AGREEMENT",
  ]),
  score: z.number().int().min(0).max(100),
  weight: z.number().positive().max(1),
});

export const forecastConfidenceSchema = z.object({
  score: z.number().int().min(0).max(100),
  level: z.enum(["LOW", "MEDIUM", "HIGH"]),
  factors: z.array(forecastConfidenceFactorSchema),
});

export type ForecastConfidence = z.infer<typeof forecastConfidenceSchema>;
export type ForecastConfidenceFactor = z.infer<
  typeof forecastConfidenceFactorSchema
>;
