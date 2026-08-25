import type { CoastalLocation } from "@kuda-krym/contracts";
import { PublicationStatus, type PrismaClient } from "@kuda-krym/database";
import type { CoastalLocationRepository } from "./coastal-location.repository.js";

const coastalLocationSelect = {
  id: true,
  slug: true,
  name: true,
  region: true,
  waterBody: true,
  weatherLatitude: true,
  weatherLongitude: true,
  marineLatitude: true,
  marineLongitude: true,
} as const;

type DecimalValue = Readonly<{ toNumber(): number }>;

type CoastalLocationRecord = Readonly<{
  id: string;
  slug: string;
  name: string;
  region: CoastalLocation["region"];
  waterBody: CoastalLocation["waterBody"];
  weatherLatitude: DecimalValue;
  weatherLongitude: DecimalValue;
  marineLatitude: DecimalValue;
  marineLongitude: DecimalValue;
}>;

export class PrismaCoastalLocationRepository
  implements CoastalLocationRepository
{
  public constructor(private readonly prisma: PrismaClient) {}

  public async findPublished(): Promise<CoastalLocation[]> {
    const locations = await this.prisma.coastalLocation.findMany({
      where: { publicationStatus: PublicationStatus.PUBLISHED },
      select: coastalLocationSelect,
      orderBy: [{ region: "asc" }, { name: "asc" }],
    });

    return locations.map(mapCoastalLocation);
  }

  public async findPublishedBySlug(
    slug: string,
  ): Promise<CoastalLocation | null> {
    const location = await this.prisma.coastalLocation.findFirst({
      where: { slug, publicationStatus: PublicationStatus.PUBLISHED },
      select: coastalLocationSelect,
    });

    return location ? mapCoastalLocation(location) : null;
  }
}

function mapCoastalLocation(
  location: CoastalLocationRecord,
): CoastalLocation {
  return {
    id: location.id,
    slug: location.slug,
    name: location.name,
    region: location.region,
    waterBody: location.waterBody,
    weatherCoordinates: {
      latitude: location.weatherLatitude.toNumber(),
      longitude: location.weatherLongitude.toNumber(),
    },
    marineCoordinates: {
      latitude: location.marineLatitude.toNumber(),
      longitude: location.marineLongitude.toNumber(),
    },
  };
}
