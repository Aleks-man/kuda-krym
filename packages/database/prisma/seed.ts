import "dotenv/config";

import {
  BeachField,
  DataSourceType,
  PublicationStatus,
  VerificationStatus,
} from "../src/generated/prisma/client.js";
import { createPrismaClient } from "../src/client.js";
import { seedBeaches } from "./seed-data/beaches.js";
import { seedPublishedCoastalLocations } from "./seed-coastal-locations.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const prisma = createPrismaClient(databaseUrl);
const retrievedAt = new Date("2026-08-20T00:00:00.000Z");

function getOsmUrl(osmType: string, osmId: bigint): string {
  return `https://www.openstreetmap.org/${osmType.toLowerCase()}/${osmId}`;
}

async function seed() {
  await seedPublishedCoastalLocations(prisma);

  for (const item of seedBeaches) {
    await prisma.$transaction(async (transaction) => {
      const sourceUrl = getOsmUrl(item.osmType, item.osmId);
      const existingSource = await transaction.dataSource.findFirst({
        where: { url: sourceUrl },
      });
      const source = existingSource
        ? await transaction.dataSource.update({
            where: { id: existingSource.id },
            data: {
              title: `OpenStreetMap: ${item.officialName}`,
              retrievedAt,
            },
          })
        : await transaction.dataSource.create({
            data: {
              type: DataSourceType.OPENSTREETMAP,
              title: `OpenStreetMap: ${item.officialName}`,
              url: sourceUrl,
              license: "ODbL 1.0",
              retrievedAt,
            },
          });

      const beach = await transaction.beach.upsert({
        where: { slug: item.slug },
        update: {
          name: item.name,
          officialName: item.officialName,
          region: item.region,
          locality: item.locality,
          latitude: item.latitude,
          longitude: item.longitude,
          osmType: item.osmType,
          osmId: item.osmId,
          coastalLocation: { connect: { slug: item.coastalLocationSlug } },
          publicationStatus: PublicationStatus.PUBLISHED,
        },
        create: {
          slug: item.slug,
          name: item.name,
          officialName: item.officialName,
          region: item.region,
          locality: item.locality,
          latitude: item.latitude,
          longitude: item.longitude,
          osmType: item.osmType,
          osmId: item.osmId,
          coastalLocation: { connect: { slug: item.coastalLocationSlug } },
          publicationStatus: PublicationStatus.PUBLISHED,
          profile: { create: {} },
        },
      });

      for (const field of [BeachField.NAME, BeachField.COORDINATES]) {
        await transaction.beachFieldEvidence.updateMany({
          where: {
            beachId: beach.id,
            field,
            sourceId: { not: source.id },
          },
          data: {
            status: VerificationStatus.REJECTED,
            isPrimary: false,
            note: "Источник заменён после повторной проверки OSM-объекта.",
          },
        });

        await transaction.beachFieldEvidence.upsert({
          where: {
            beachId_field_sourceId: {
              beachId: beach.id,
              field,
              sourceId: source.id,
            },
          },
          update: {
            status: VerificationStatus.MANUALLY_CHECKED,
            verifiedAt: retrievedAt,
            isPrimary: true,
          },
          create: {
            beachId: beach.id,
            field,
            sourceId: source.id,
            status: VerificationStatus.MANUALLY_CHECKED,
            verifiedAt: retrievedAt,
            isPrimary: true,
          },
        });
      }
    });
  }

  console.log(`Seeded ${seedBeaches.length} published beaches.`);
}

try {
  await seed();
} finally {
  await prisma.$disconnect();
}

