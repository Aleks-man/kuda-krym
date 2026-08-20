import { z } from "zod";

const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const beachForecastSchema = z.object({
  beach: z.object({
    id: z.uuid(),
    slug: z.string().min(1),
    name: z.string().min(1),
    coordinates: coordinatesSchema,
  }),
  timezone: z.literal("UTC"),
  generatedAt: z.iso.datetime(),
  hourly: z.array(
    z.object({
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
    }),
  ),
});

export type BeachForecast = z.infer<typeof beachForecastSchema>;
