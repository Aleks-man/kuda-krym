import { z } from "zod";

export const recommendationOriginSchema = z.enum([
  "simferopol",
  "sevastopol",
  "yalta",
  "evpatoria",
  "feodosia",
  "kerch",
]);

export const recommendationDateSchema = z.iso.date();
export const recommendationTimeSchema = z.enum(["morning", "day", "evening"]);
export const recommendationCompanySchema = z.enum([
  "alone",
  "children",
  "friends",
]);
export const recommendationSurfaceSchema = z.enum(["any", "sand", "pebble"]);
export const recommendationPrioritySchema = z.enum([
  "calm_sea",
  "warm_water",
  "comfort",
]);

export const recommendationRequestSchema = z
  .object({
    origin: recommendationOriginSchema,
    date: recommendationDateSchema,
    time: recommendationTimeSchema,
    company: recommendationCompanySchema,
    surface: recommendationSurfaceSchema,
    priority: recommendationPrioritySchema,
  })
  .strict();

export type RecommendationRequest = z.infer<
  typeof recommendationRequestSchema
>;
