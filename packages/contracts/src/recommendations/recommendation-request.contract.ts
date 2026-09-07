import { z } from "zod";
import { departureLocationSchema } from "./departure-location-search.contract.js";

export const recommendationOriginCodeSchema = z.enum([
  "simferopol",
  "sevastopol",
  "yalta",
  "evpatoria",
  "feodosia",
  "kerch",
  "alushta",
  "sudak",
  "saki",
  "bakhchisaray",
  "dzhankoy",
  "belogorsk",
  "krasnoperekopsk",
  "armyansk",
  "chernomorskoe",
  "shchelkino",
]);
export const recommendationOriginSchema = z.union([
  recommendationOriginCodeSchema,
  departureLocationSchema,
]);

export const recommendationDateSchema = z.iso.date();
export const recommendationTimeSchema = z.enum([
  "morning",
  "day",
  "evening",
  "all_day",
]);
export const recommendationPrioritySchema = z.enum([
  "calm_sea",
  "warm_water",
  "comfort",
]);
export const recommendationMaxTravelMinutesSchema = z
  .number()
  .int()
  .min(30)
  .max(240);

export const recommendationRequestSchema = z
  .object({
    origin: recommendationOriginSchema,
    date: recommendationDateSchema,
    time: recommendationTimeSchema,
    priority: recommendationPrioritySchema,
    maxTravelMinutes: recommendationMaxTravelMinutesSchema,
  })
  .strict();

export type RecommendationRequest = z.infer<
  typeof recommendationRequestSchema
>;
export type RecommendationOriginCode = z.infer<
  typeof recommendationOriginCodeSchema
>;
