import type { PrismaClient } from "../src/generated/prisma/client.js";
import { seedCoastalLocationImages } from "./seed-data/coastal-location-images.js";
import { toSeedImageData } from "./seed-image-data.js";

export async function seedPublishedCoastalLocationImages(
  prisma: PrismaClient,
): Promise<void> {
  const locations = await prisma.coastalLocation.findMany({
    where: {
      slug: {
        in: seedCoastalLocationImages.map((image) => image.coastalLocationSlug),
      },
    },
    select: { id: true, slug: true },
  });
  const locationIds = new Map(
    locations.map((location) => [location.slug, location.id]),
  );

  await prisma.$transaction(async (transaction) => {
    await transaction.coastalLocationImage.deleteMany({
      where: { coastalLocationId: { in: [...locationIds.values()] } },
    });

    for (const image of seedCoastalLocationImages) {
      const coastalLocationId = locationIds.get(image.coastalLocationSlug);
      if (!coastalLocationId) {
        throw new Error(
          `Cannot seed image for unknown coastal location: ${image.coastalLocationSlug}`,
        );
      }

      await transaction.coastalLocationImage.create({
        data: { coastalLocationId, ...toSeedImageData(image) },
      });
    }
  });

  console.log(
    `Seeded ${seedCoastalLocationImages.length} coastal location images.`,
  );
}
