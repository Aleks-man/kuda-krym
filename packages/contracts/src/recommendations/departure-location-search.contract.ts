import { z } from "zod";

export const departureLocationSearchQuerySchema = z
  .object({
    query: z.string().trim().min(2).max(80),
  })
  .strict();

export const departureLocationSchema = z
  .object({
    id: z.string().min(1).max(120),
    name: z.string().min(1).max(120),
    context: z.string().max(240),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();

export const departureLocationSearchResponseSchema = z
  .object({
    data: z.array(departureLocationSchema).max(8),
  })
  .strict();

export type DepartureLocationSearchQuery = z.infer<
  typeof departureLocationSearchQuerySchema
>;
export type DepartureLocation = z.infer<typeof departureLocationSchema>;
export type DepartureLocationSearchResponse = z.infer<
  typeof departureLocationSearchResponseSchema
>;
