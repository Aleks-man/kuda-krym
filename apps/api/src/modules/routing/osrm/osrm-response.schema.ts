import { z } from "zod";

const coordinateSchema = z.tuple([
  z.number().min(-180).max(180),
  z.number().min(-90).max(90),
]);

export const osrmResponseSchema = z.object({
  code: z.string(),
  routes: z.array(
    z.object({
      distance: z.number().nonnegative(),
      duration: z.number().nonnegative(),
      geometry: z.object({
        type: z.literal("LineString"),
        coordinates: z.array(coordinateSchema).min(2),
      }),
    }),
  ),
});

export type OsrmResponse = z.infer<typeof osrmResponseSchema>;
