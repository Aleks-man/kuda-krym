import { z } from "zod";

import { beachRegionSchema } from "./beach-list.contract.js";

const filterTextSchema = z.string().trim().min(1).max(100);

export const beachCatalogQuerySchema = z
  .object({
    q: filterTextSchema.optional(),
    region: beachRegionSchema.optional(),
    locality: filterTextSchema.optional(),
  })
  .strict();

export const beachCatalogFilterOptionsSchema = z.object({
  data: z.object({
    regions: z.array(beachRegionSchema),
    localities: z.array(z.string().trim().min(1)),
  }),
});

export type BeachCatalogQuery = z.infer<typeof beachCatalogQuerySchema>;
export type BeachCatalogFilterOptions = z.infer<
  typeof beachCatalogFilterOptionsSchema
>;
