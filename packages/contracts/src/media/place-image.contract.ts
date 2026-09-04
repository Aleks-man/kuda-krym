import { z } from "zod";

export const placeImageUrlSchema = z
  .string()
  .startsWith("/images/places/")
  .endsWith(".webp");

export const placeImageSchema = z.object({
  url: placeImageUrlSchema,
  alt: z.string().min(1),
  title: z.string().min(1).nullable(),
  author: z.string().min(1),
  license: z.string().min(1),
  licenseUrl: z.url().nullable(),
  sourceUrl: z.url(),
});

export type PlaceImage = z.infer<typeof placeImageSchema>;
