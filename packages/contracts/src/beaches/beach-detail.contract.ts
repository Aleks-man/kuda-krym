import { z } from "zod";

import {
  beachListItemSchema,
  childSuitabilitySchema,
} from "./beach-list.contract.js";

export const beachDetailSchema = beachListItemSchema.extend({
  officialName: z.string().min(1).nullable(),
  description: z.string().min(1).nullable(),
  profile: z.object({
    waterEntry: z.enum(["UNKNOWN", "GENTLE", "MODERATE", "STEEP"]),
    childSuitability: childSuitabilitySchema,
    infrastructure: z.enum(["UNKNOWN", "NONE", "BASIC", "DEVELOPED"]),
    parking: z.enum(["UNKNOWN", "NONE", "REMOTE", "NEARBY", "ON_SITE"]),
    accessibility: z.enum(["UNKNOWN", "LIMITED", "ACCESSIBLE"]),
    bayProtection: z.enum(["UNKNOWN", "OPEN", "PARTIAL", "PROTECTED"]),
    hasToilet: z.enum(["UNKNOWN", "YES", "NO"]),
    hasShower: z.enum(["UNKNOWN", "YES", "NO"]),
    hasChangingRoom: z.enum(["UNKNOWN", "YES", "NO"]),
  }),
  images: z.array(
    z.object({
      url: z.url(),
      alt: z.string().min(1),
      author: z.string().min(1),
      license: z.string().min(1),
      sourceUrl: z.url(),
    }),
  ),
  sources: z.array(
    z.object({
      field: z.string().min(1),
      title: z.string().min(1),
      url: z.url(),
      status: z.enum(["MANUALLY_CHECKED", "CONFLICTING", "STALE"]),
      verifiedAt: z.iso.datetime().nullable(),
    }),
  ),
});

export type BeachDetail = z.infer<typeof beachDetailSchema>;
