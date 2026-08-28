import { OsmType, Region } from "../../../src/generated/prisma/client.js";

import type { SeedBeach } from "./beach-seed.types.js";

export const southCoastBeaches = [
  {
    slug: "alushta-city-beach",
    name: "Городской пляж Алушты",
    officialName: "Городской пляж",
    region: Region.SOUTH_COAST,
    locality: "Алушта",
    coastalLocationSlug: "alushta",
    latitude: "44.673934",
    longitude: "34.416429",
    osmType: OsmType.WAY,
    osmId: 231221208n,
    sourceRetrievedAt: "2026-08-20T00:00:00.000Z",
  },
] as const satisfies readonly SeedBeach[];
