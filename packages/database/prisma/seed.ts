import "dotenv/config";

import {
  BeachField,
  DataSourceType,
  VerificationStatus,
} from "../src/generated/prisma/client.js";
import { createPrismaClient } from "../src/client.js";
import { seedBeaches } from "./seed-data/beaches.js";

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
          profile: { create: {} },
        },
      });

      for (const field of [BeachField.NAME, BeachField.COORDINATES]) {
        await transaction.beachFieldEvidence.upsert({
          where: {
            beachId_field_sourceId: {
              beachId: beach.id,
              field,
              sourceId: source.id,
            },
          },
          update: {
            status: VerificationStatus.IMPORTED,
            isPrimary: true,
          },
          create: {
            beachId: beach.id,
            field,
            sourceId: source.id,
            status: VerificationStatus.IMPORTED,
            isPrimary: true,
          },
        });
      }
    });
  }

  console.log(`Seeded ${seedBeaches.length} draft beaches.`);
}

try {
  await seed();
} finally {
  await prisma.$disconnect();
}

