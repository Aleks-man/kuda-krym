import { z } from "zod";

const latitudeSchema = z.number().min(-90).max(90);
const longitudeSchema = z.number().min(-180).max(180);

export const routePointSchema = z
  .object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
  })
  .strict();

export const routeRequestSchema = z
  .object({
    origin: routePointSchema,
    beachId: z.uuid(),
    profile: z.literal("DRIVING").default("DRIVING"),
  })
  .strict();

const lineCoordinateSchema = z.tuple([longitudeSchema, latitudeSchema]);

export const routeResponseSchema = z.object({
  data: z.object({
    origin: routePointSchema,
    destination: routePointSchema,
    distanceMeters: z.number().int().nonnegative(),
    durationSeconds: z.number().int().nonnegative(),
    geometry: z.object({
      type: z.literal("LineString"),
      coordinates: z.array(lineCoordinateSchema).min(2),
    }),
  }),
  meta: z.object({
    source: z.literal("OSRM"),
    calculatedAt: z.iso.datetime(),
    cached: z.boolean(),
  }),
});

export type RoutePoint = z.infer<typeof routePointSchema>;
export type RouteRequest = z.infer<typeof routeRequestSchema>;
export type RouteResponse = z.infer<typeof routeResponseSchema>;
