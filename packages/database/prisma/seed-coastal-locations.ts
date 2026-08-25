import {
  PublicationStatus,
  type PrismaClient,
} from "../src/generated/prisma/client.js";
import { seedCoastalLocations } from "./seed-data/coastal-locations.js";

export async function seedPublishedCoastalLocations(prisma: PrismaClient) {
  for (const location of seedCoastalLocations) {
    await prisma.coastalLocation.upsert({
      where: { slug: location.slug },
      update: {
        ...location,
        publicationStatus: PublicationStatus.PUBLISHED,
      },
      create: {
        ...location,
        publicationStatus: PublicationStatus.PUBLISHED,
      },
    });
  }

  console.log(
    `Seeded ${seedCoastalLocations.length} published coastal locations.`,
  );
}
