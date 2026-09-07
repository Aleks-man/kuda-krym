import { z } from "zod";

import { beachRegionSchema } from "./beach-list.contract.js";

export const beachCatalogQuerySchema = z
  .object({
    region: beachRegionSchema.optional(),
  })
  .strict();

export const beachCatalogFilterOptionsSchema = z.object({
  data: z.object({
    regions: z.array(beachRegionSchema),
  }),
});

export type BeachCatalogQuery = z.infer<typeof beachCatalogQuerySchema>;
export type BeachCatalogFilterOptions = z.infer<
  typeof beachCatalogFilterOptionsSchema
>;
