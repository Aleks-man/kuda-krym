import { z } from "zod";

import { beachListResponseSchema } from "../beaches/beach-list.contract.js";
import { coastalLocationSchema } from "./coastal-location.contract.js";

export const coastalLocationBeachesResponseSchema =
  beachListResponseSchema.extend({
    location: coastalLocationSchema,
  });

export type CoastalLocationBeachesResponse = z.infer<
  typeof coastalLocationBeachesResponseSchema
>;
