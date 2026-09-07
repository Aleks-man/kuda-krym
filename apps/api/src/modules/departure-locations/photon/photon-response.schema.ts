import { z } from "zod";

const photonFeatureSchema = z.object({
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  properties: z.object({
    name: z.string().min(1),
    osm_type: z.string().min(1),
    osm_id: z.union([z.string(), z.number()]),
    osm_key: z.string().optional(),
    osm_value: z.string().optional(),
    city: z.string().optional(),
    county: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }),
});

export const photonResponseSchema = z.object({
  features: z.array(photonFeatureSchema),
});

export type PhotonFeature = z.infer<typeof photonFeatureSchema>;
