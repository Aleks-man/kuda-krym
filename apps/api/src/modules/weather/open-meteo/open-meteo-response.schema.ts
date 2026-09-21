import { z } from "zod";

export const openMeteoResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.literal("GMT"),
  current: z.object({
    time: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
    interval: z.number().int().positive(),
    temperature_2m: z.number(),
    apparent_temperature: z.number().nullable().optional(),
    relative_humidity_2m: z.number().min(0).max(100).nullable().optional(),
    surface_pressure: z.number().positive().nullable().optional(),
    visibility: z.number().nonnegative().nullable().optional(),
    uv_index: z.number().nonnegative().nullable().optional(),
    precipitation: z.number().nonnegative(),
    wind_speed_10m: z.number().nonnegative(),
    wind_direction_10m: z.number().min(0).max(360),
    wind_gusts_10m: z.number().nonnegative(),
    cloud_cover: z.number().min(0).max(100),
    weather_code: z.number().int().min(0).max(99).nullable().optional(),
    is_day: z.union([z.literal(0), z.literal(1)]).nullable().optional(),
  }).nullable().optional().catch(null),
  daily: z.object({
    time: z.array(z.string()),
    sunrise: z.array(z.string()),
    sunset: z.array(z.string()),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    surface_pressure: z.array(z.number().positive().nullable()).optional(),
    visibility: z.array(z.number().nonnegative().nullable()).optional(),
    uv_index: z.array(z.number().nonnegative().nullable()).optional(),
    relative_humidity_2m: z.array(z.number().min(0).max(100).nullable()).optional(),
    apparent_temperature: z.array(z.number().nullable()).optional(),
    precipitation_probability: z.array(z.number().min(0).max(100)),
    precipitation: z.array(z.number().nonnegative()),
    wind_speed_10m: z.array(z.number().nonnegative()),
    wind_direction_10m: z.array(z.number().min(0).max(360)),
    wind_gusts_10m: z.array(z.number().nonnegative()),
    cloud_cover: z.array(z.number().min(0).max(100)),
  }),
});

export type OpenMeteoResponse = z.infer<typeof openMeteoResponseSchema>;
