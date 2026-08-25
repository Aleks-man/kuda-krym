import { z } from "zod";
import { beachRegionSchema } from "../beaches/beach-list.contract.js";
import { forecastCoordinatesSchema } from "../forecast/forecast-hour.contract.js";

export const waterBodySchema = z.enum([
  "BLACK_SEA",
  "AZOV_SEA",
  "KERCH_STRAIT",
]);

export const coastalLocationSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  region: beachRegionSchema,
  waterBody: waterBodySchema,
  weatherCoordinates: forecastCoordinatesSchema,
  marineCoordinates: forecastCoordinatesSchema,
});

export const coastalLocationListResponseSchema = z.object({
  data: z.array(coastalLocationSchema),
  meta: z.object({ total: z.number().int().nonnegative() }),
});

export type CoastalLocation = z.infer<typeof coastalLocationSchema>;
export type CoastalLocationListResponse = z.infer<
  typeof coastalLocationListResponseSchema
>;
