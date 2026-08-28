import type {
  OsmType,
  Region,
} from "../../../src/generated/prisma/client.js";

export type SeedBeach = Readonly<{
  slug: string;
  name: string;
  officialName: string;
  region: Region;
  locality: string;
  coastalLocationSlug: string;
  latitude: string;
  longitude: string;
  osmType: OsmType;
  osmId: bigint;
  sourceRetrievedAt: string;
}>;
