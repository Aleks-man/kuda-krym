import { OsmType, Region } from "../../../src/generated/prisma/client.js";

import type { SeedBeach } from "./beach-seed.types.js";

const sourceRetrievedAt = "2026-08-20T00:00:00.000Z";

export const sevastopolBeaches = [
  {
    slug: "uchkuevka",
    name: "Пляж Учкуевка",
    officialName: "Учкуевка",
    region: Region.SEVASTOPOL,
    locality: "Севастополь",
    coastalLocationSlug: "sevastopol-north",
    latitude: "44.644844",
    longitude: "33.536119",
    osmType: OsmType.WAY,
    osmId: 130042680n,
    sourceRetrievedAt,
  },
  {
    slug: "lyubimovka",
    name: "Пляж Любимовка",
    officialName: "Любимовка",
    region: Region.SEVASTOPOL,
    locality: "Севастополь",
    coastalLocationSlug: "sevastopol-north",
    latitude: "44.659856",
    longitude: "33.543911",
    osmType: OsmType.WAY,
    osmId: 129971155n,
    sourceRetrievedAt,
  },
  {
    slug: "omega",
    name: "Пляж Омега",
    officialName: "Пляж Омега",
    region: Region.SEVASTOPOL,
    locality: "Севастополь",
    coastalLocationSlug: "sevastopol-west",
    latitude: "44.597638",
    longitude: "33.444116",
    osmType: OsmType.WAY,
    osmId: 230870022n,
    sourceRetrievedAt,
  },
  {
    slug: "yashmovyy",
    name: "Яшмовый пляж",
    officialName: "Яшмовый пляж",
    region: Region.SEVASTOPOL,
    locality: "Севастополь",
    coastalLocationSlug: "fiolent",
    latitude: "44.503340",
    longitude: "33.507753",
    osmType: OsmType.WAY,
    osmId: 410891199n,
    sourceRetrievedAt,
  },
] as const satisfies readonly SeedBeach[];
