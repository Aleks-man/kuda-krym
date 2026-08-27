import { z } from "zod";
import { forecastCoordinatesSchema } from "../forecast/forecast-hour.contract.js";
import { forecastSourceFreshnessSchema } from "../forecast/forecast-freshness.contract.js";

export const weatherModelSchema = z.enum([
  "ECMWF_IFS",
  "DWD_ICON",
  "NOAA_GFS",
]);

const modelConditionsSchema = z.object({
  temperatureCelsius: z.number(),
  precipitationMillimeters: z.number().nonnegative(),
  windSpeedMetersPerSecond: z.number().nonnegative(),
  windDirectionDegrees: z.number().min(0).max(360),
  windGustMetersPerSecond: z.number().nonnegative(),
  cloudCoverPercent: z.number().min(0).max(100),
});

const modelSampleSchema = z.object({
  model: weatherModelSchema,
  generatedAt: z.iso.datetime(),
  conditions: modelConditionsSchema,
});

const agreementFactorSchema = z.object({
  name: z.enum([
    "TEMPERATURE",
    "PRECIPITATION",
    "WIND_SPEED",
    "WIND_DIRECTION",
    "WIND_GUST",
    "CLOUD_COVER",
  ]),
  spread: z.number().nonnegative(),
  unit: z.enum(["CELSIUS", "MILLIMETERS", "MPS", "DEGREES", "PERCENT"]),
  score: z.number().int().min(0).max(100),
  weight: z.number().positive().max(1),
});

const agreementSchema = z.object({
  modelCount: z.number().int().min(0).max(3),
  score: z.number().int().min(0).max(100).nullable(),
  level: z.enum(["LOW", "MEDIUM", "HIGH", "INSUFFICIENT_DATA"]),
  factors: z.array(agreementFactorSchema),
});

export const weatherModelComparisonResponseSchema = z.object({
  location: forecastCoordinatesSchema,
  generatedAt: z.iso.datetime(),
  freshness: forecastSourceFreshnessSchema.nullable(),
  models: z.object({
    available: z.array(weatherModelSchema),
    failures: z.array(
      z.object({
        model: weatherModelSchema,
        code: z.literal("MODEL_UNAVAILABLE"),
      }),
    ),
  }),
  hourly: z.array(
    z.object({
      time: z.string().min(1),
      samples: z.array(modelSampleSchema),
      agreement: agreementSchema,
    }),
  ),
});

export type WeatherModel = z.infer<typeof weatherModelSchema>;
export type WeatherModelComparisonResponse = z.infer<
  typeof weatherModelComparisonResponseSchema
>;
