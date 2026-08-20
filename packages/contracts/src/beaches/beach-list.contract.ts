import { z } from "zod";

export const beachRegionSchema = z.enum([
  "WEST_CRIMEA",
  "SOUTH_COAST",
  "EAST_CRIMEA",
  "SEVASTOPOL",
  "KERCH_PENINSULA",
]);

export const beachSurfaceSchema = z.enum([
  "UNKNOWN",
  "SAND",
  "PEBBLE",
  "MIXED",
  "ROCK",
]);

export const childSuitabilitySchema = z.enum([
  "UNKNOWN",
  "SUITABLE",
  "LIMITED",
  "UNSUITABLE",
]);

export const beachListItemSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  region: beachRegionSchema,
  locality: z.string().min(1).nullable(),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  surface: beachSurfaceSchema,
  childSuitability: childSuitabilitySchema,
  coverImageUrl: z.url().nullable(),
});

export const beachListResponseSchema = z.object({
  data: z.array(beachListItemSchema),
  meta: z.object({
    total: z.number().int().nonnegative(),
  }),
});

export type BeachListItem = z.infer<typeof beachListItemSchema>;
export type BeachListResponse = z.infer<typeof beachListResponseSchema>;

