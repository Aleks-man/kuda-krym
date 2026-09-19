import { z } from "zod";

export const openMeteoResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.literal("GMT"),
  daily: z.object({
    time: z.array(z.string()),
    sunrise: z.array(z.string()),
    sunset: z.array(z.string()),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
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
