import type {
  BeachCatalogFilterOptions,
  BeachCatalogQuery,
  BeachDetail,
  BeachListItem,
} from "@kuda-krym/contracts";
import {
  PublicationStatus,
  VerificationStatus,
  type Prisma,
  type PrismaClient,
} from "@kuda-krym/database";

import type { BeachRepository } from "./beach.repository.js";
import { selectBeachCoverImage } from "./beach-cover-image.js";
import { createPublishedBeachWhere } from "./beach-catalog.where.js";

const coverImageSelect = {
  url: true,
  alt: true,
  title: true,
  author: true,
  license: true,
  licenseUrl: true,
  sourceUrl: true,
} as const;

export class PrismaBeachRepository implements BeachRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async findPublished(
    query: BeachCatalogQuery = {},
  ): Promise<BeachListItem[]> {
    return this.findPublishedWhere(createPublishedBeachWhere(query));
  }

  public async findPublishedByCoastalLocationSlug(
    slug: string,
  ): Promise<BeachListItem[]> {
    return this.findPublishedWhere({
      ...createPublishedBeachWhere({}),
      coastalLocation: {
        is: {
          slug,
          publicationStatus: PublicationStatus.PUBLISHED,
        },
      },
    });
  }

  private async findPublishedWhere(
    where: Prisma.BeachWhereInput,
  ): Promise<BeachListItem[]> {
    const beaches = await this.prisma.beach.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        region: true,
        locality: true,
        latitude: true,
        longitude: true,
        profile: {
          select: {
            surface: true,
            childSuitability: true,
          },
        },
        images: {
          where: { isCover: true },
          select: coverImageSelect,
          take: 1,
        },
        coastalLocation: {
          select: {
            images: {
              where: { isCover: true },
              select: coverImageSelect,
              take: 1,
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return beaches.map((beach) => {
      if (!beach.profile) {
        throw new Error(`Published beach ${beach.id} has no profile`);
      }

      return {
        id: beach.id,
        slug: beach.slug,
        name: beach.name,
        region: beach.region,
        locality: beach.locality,
        coordinates: {
          latitude: beach.latitude.toNumber(),
          longitude: beach.longitude.toNumber(),
        },
        surface: beach.profile.surface,
        childSuitability: beach.profile.childSuitability,
        coverImage: selectBeachCoverImage(
          beach.images,
          beach.coastalLocation?.images ?? [],
        ),
      };
    });
  }

  public async findPublishedFilterOptions(): Promise<
    BeachCatalogFilterOptions["data"]
  > {
    const publishedWhere = createPublishedBeachWhere({});
    const [regionRows, localityRows] = await Promise.all([
      this.prisma.beach.findMany({
        where: publishedWhere,
        select: { region: true },
        distinct: ["region"],
        orderBy: { region: "asc" },
      }),
      this.prisma.beach.findMany({
        where: { ...publishedWhere, locality: { not: null } },
        select: { locality: true },
        distinct: ["locality"],
        orderBy: { locality: "asc" },
      }),
    ]);

    return {
      regions: regionRows.map(({ region }) => region),
      localities: localityRows.flatMap(({ locality }) =>
        locality === null ? [] : [locality],
      ),
    };
  }

  public async findPublishedBySlug(slug: string): Promise<BeachDetail | null> {
    const beach = await this.prisma.beach.findFirst({
      where: {
        slug,
        publicationStatus: PublicationStatus.PUBLISHED,
        profile: { isNot: null },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        officialName: true,
        description: true,
        region: true,
        locality: true,
        latitude: true,
        longitude: true,
        profile: {
          select: {
            surface: true,
            waterEntry: true,
            childSuitability: true,
            infrastructure: true,
            parking: true,
            accessibility: true,
            bayProtection: true,
            hasToilet: true,
            hasShower: true,
            hasChangingRoom: true,
          },
        },
        images: {
          select: {
            url: true,
            alt: true,
            title: true,
            author: true,
            license: true,
            licenseUrl: true,
            sourceUrl: true,
            isCover: true,
          },
          orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }],
        },
        coastalLocation: {
          select: {
            images: {
              where: { isCover: true },
              select: coverImageSelect,
              take: 1,
            },
          },
        },
        evidence: {
          where: {
            isPrimary: true,
            status: {
              in: [
                VerificationStatus.MANUALLY_CHECKED,
                VerificationStatus.CONFLICTING,
                VerificationStatus.STALE,
              ],
            },
          },
          select: {
            field: true,
            status: true,
            verifiedAt: true,
            source: { select: { title: true, url: true } },
          },
          orderBy: { field: "asc" },
        },
      },
    });

    if (!beach?.profile) {
      return null;
    }

    return {
      id: beach.id,
      slug: beach.slug,
      name: beach.name,
      officialName: beach.officialName,
      description: beach.description,
      region: beach.region,
      locality: beach.locality,
      coordinates: {
        latitude: beach.latitude.toNumber(),
        longitude: beach.longitude.toNumber(),
      },
      surface: beach.profile.surface,
      childSuitability: beach.profile.childSuitability,
      coverImage: selectBeachCoverImage(
        beach.images.filter((image) => image.isCover),
        beach.coastalLocation?.images ?? [],
      ),
      profile: {
        waterEntry: beach.profile.waterEntry,
        childSuitability: beach.profile.childSuitability,
        infrastructure: beach.profile.infrastructure,
        parking: beach.profile.parking,
        accessibility: beach.profile.accessibility,
        bayProtection: beach.profile.bayProtection,
        hasToilet: beach.profile.hasToilet,
        hasShower: beach.profile.hasShower,
        hasChangingRoom: beach.profile.hasChangingRoom,
      },
      images: beach.images.map(
        ({ isCover: _isCover, title: _title, licenseUrl: _licenseUrl, ...image }) =>
          image,
      ),
      sources: beach.evidence.map((evidence) => ({
        field: evidence.field,
        title: evidence.source.title,
        url: evidence.source.url,
        status: evidence.status as BeachDetail["sources"][number]["status"],
        verifiedAt: evidence.verifiedAt?.toISOString() ?? null,
      })),
    };
  }
}

