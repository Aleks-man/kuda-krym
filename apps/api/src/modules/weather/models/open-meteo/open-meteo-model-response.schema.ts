import { z } from "zod";

export const openMeteoModelResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.literal("GMT"),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    precipitation: z.array(z.number().nonnegative()),
    wind_speed_10m: z.array(z.number().nonnegative()),
    wind_direction_10m: z.array(z.number().min(0).max(360)),
    wind_gusts_10m: z.array(z.number().nonnegative()),
    cloud_cover: z.array(z.number().min(0).max(100)),
  }),
});

export type OpenMeteoModelResponse = z.infer<
  typeof openMeteoModelResponseSchema
>;
