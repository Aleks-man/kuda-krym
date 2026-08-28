import { OsmType, Region } from "../../../src/generated/prisma/client.js";

import type { SeedBeach } from "./beach-seed.types.js";

const sourceRetrievedAt = "2026-08-20T00:00:00.000Z";

export const eastCrimeaBeaches = [
  {
    slug: "sudak-central",
    name: "Центральный городской пляж Судака",
    officialName: "Центральный городской пляж",
    region: Region.EAST_CRIMEA,
    locality: "Судак",
    coastalLocationSlug: "sudak",
    latitude: "44.839935",
    longitude: "34.973753",
    osmType: OsmType.WAY,
    osmId: 169812393n,
    sourceRetrievedAt,
  },
  {
    slug: "feodosia-golden-beach",
    name: "Золотой пляж",
    officialName: "Золотой пляж",
    region: Region.EAST_CRIMEA,
    locality: "Береговое",
    coastalLocationSlug: "beregovoe",
    latitude: "45.084927",
    longitude: "35.425032",
    osmType: OsmType.RELATION,
    osmId: 9338571n,
    sourceRetrievedAt,
  },
] as const satisfies readonly SeedBeach[];
