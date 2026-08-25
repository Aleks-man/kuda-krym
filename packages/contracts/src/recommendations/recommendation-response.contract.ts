import { z } from "zod";

const nullableMeasurement = z.number().nullable();

const recommendationItemSchema = z.object({
  position: z.number().int().min(1).max(3),
  beach: z.object({
    id: z.uuid(),
    slug: z.string().min(1),
    name: z.string().min(1),
    coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
    surface: z.enum(["UNKNOWN", "SAND", "PEBBLE", "MIXED", "ROCK"]),
    childSuitability: z.enum([
      "UNKNOWN",
      "SUITABLE",
      "LIMITED",
      "UNSUITABLE",
    ]),
  }),
  score: z.number().int().min(0).max(100),
  rawScore: z.number().int().min(0).max(100),
  confidencePercent: z.number().int().min(0).max(100),
  hourCount: z.number().int().positive(),
  travel: z.object({
    distanceMeters: z.number().int().nonnegative(),
    durationMinutes: z.number().int().nonnegative(),
  }),
  components: z.array(
    z.object({
      name: z.enum(["SEA", "WEATHER", "WARM_WATER"]),
      score: z.number().min(0).max(100).nullable(),
      coveragePercent: z.number().int().min(0).max(100),
      weight: z.number().positive().max(1),
    }),
  ),
  conditions: z.object({
    airTemperatureCelsius: nullableMeasurement,
    seaSurfaceTemperatureCelsius: nullableMeasurement,
    waveHeightMeters: z.number().nonnegative().nullable(),
    windSpeedMetersPerSecond: z.number().nonnegative().nullable(),
    precipitationProbabilityPercent: z.number().min(0).max(100).nullable(),
  }),
});

export const recommendationResponseSchema = z.object({
  data: z.array(recommendationItemSchema).max(3),
  context: z.object({
    origin: z.object({ code: z.string().min(1), name: z.string().min(1) }),
    date: z.iso.date(),
    visitWindow: z.object({
      startsAt: z.iso.datetime(),
      endsAt: z.iso.datetime(),
    }),
    priority: z.enum(["CALM_SEA", "WARM_WATER", "COMFORT"]),
    maxTravelMinutes: z.number().int().min(30).max(240),
  }),
  meta: z.object({
    candidateCount: z.number().int().nonnegative(),
    recommendationCount: z.number().int().min(0).max(3),
    unavailableCount: z.number().int().nonnegative(),
  }),
});

export type RecommendationResponse = z.infer<
  typeof recommendationResponseSchema
>;
