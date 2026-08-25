import { z } from "zod";

export const forecastCoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const scoreFactorSchema = z.object({
  name: z.enum([
    "waveHeight",
    "windSpeed",
    "waterTemperature",
    "windGust",
    "airTemperature",
    "precipitationProbability",
    "precipitationAmount",
    "cloudCover",
  ]),
  score: z.number().int().min(0).max(100).nullable(),
  weight: z.number().positive().max(1),
});

const conditionsScoreSchema = z.object({
  score: z.number().int().min(0).max(100).nullable(),
  coveragePercent: z.number().int().min(0).max(100),
  factors: z.array(scoreFactorSchema),
});

export const forecastHourSchema = z.object({
  time: z.string().min(1),
  weather: z.object({
    temperatureCelsius: z.number(),
    precipitationProbabilityPercent: z.number().min(0).max(100),
    precipitationMillimeters: z.number().nonnegative(),
    windSpeedMetersPerSecond: z.number().nonnegative(),
    windDirectionDegrees: z.number().min(0).max(360),
    windGustMetersPerSecond: z.number().nonnegative(),
    cloudCoverPercent: z.number().min(0).max(100),
  }),
  marine: z.object({
    seaSurfaceTemperatureCelsius: z.number().nullable(),
    waveHeightMeters: z.number().nonnegative().nullable(),
    waveDirectionDegrees: z.number().min(0).max(360).nullable(),
    wavePeriodSeconds: z.number().nonnegative().nullable(),
  }),
  scores: z.object({
    sea: conditionsScoreSchema,
    weather: conditionsScoreSchema,
  }),
});

export type ForecastHour = z.infer<typeof forecastHourSchema>;
