import { OsmType, Region } from "../../../src/generated/prisma/client.js";

import type { SeedBeach } from "./beach-seed.types.js";

const sourceRetrievedAt = "2026-08-20T00:00:00.000Z";

export const westCrimeaBeaches = [
  {
    slug: "olenevka-miami",
    name: "Пляж Майами",
    officialName: "Пляж Майами",
    region: Region.WEST_CRIMEA,
    locality: "Оленевка",
    coastalLocationSlug: "olenevka",
    latitude: "45.370471",
    longitude: "32.515378",
    osmType: OsmType.RELATION,
    osmId: 7110570n,
    sourceRetrievedAt,
  },
  {
    slug: "popovka",
    name: "Пляж Поповка",
    officialName: "Пляж Поповка",
    region: Region.WEST_CRIMEA,
    locality: "Поповка",
    coastalLocationSlug: "popovka",
    latitude: "45.296314",
    longitude: "33.030565",
    osmType: OsmType.RELATION,
    osmId: 7114030n,
    sourceRetrievedAt,
  },
  {
    slug: "nikolaevka-skif",
    name: "Пляж Скиф",
    officialName: "Пляж Скиф",
    region: Region.WEST_CRIMEA,
    locality: "Николаевка",
    coastalLocationSlug: "nikolaevka",
    latitude: "44.959945",
    longitude: "33.604369",
    osmType: OsmType.WAY,
    osmId: 230611686n,
    sourceRetrievedAt,
  },
] as const satisfies readonly SeedBeach[];
