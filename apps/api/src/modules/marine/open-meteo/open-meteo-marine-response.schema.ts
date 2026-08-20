import { z } from "zod";

const nullableMeasurement = z.number().nullable();

export const openMeteoMarineResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.literal("GMT"),
  hourly: z.object({
    time: z.array(z.string()),
    sea_surface_temperature: z.array(nullableMeasurement),
    wave_height: z.array(nullableMeasurement),
    wave_direction: z.array(nullableMeasurement),
    wave_period: z.array(nullableMeasurement),
  }),
});

export type OpenMeteoMarineResponse = z.infer<
  typeof openMeteoMarineResponseSchema
>;
