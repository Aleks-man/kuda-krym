import type { PrismaClient } from "../src/generated/prisma/client.js";
import { seedBeachImages } from "./seed-data/beach-images.js";
import { toSeedImageData } from "./seed-image-data.js";

export async function seedPublishedBeachImages(
  prisma: PrismaClient,
): Promise<void> {
  const beaches = await prisma.beach.findMany({
    where: { slug: { in: seedBeachImages.map((image) => image.beachSlug) } },
    select: { id: true, slug: true },
  });
  const beachIds = new Map(beaches.map((beach) => [beach.slug, beach.id]));

  await prisma.$transaction(async (transaction) => {
    await transaction.beachImage.deleteMany({
      where: { beachId: { in: [...beachIds.values()] } },
    });

    for (const image of seedBeachImages) {
      const beachId = beachIds.get(image.beachSlug);
      if (!beachId) {
        throw new Error(`Cannot seed image for unknown beach: ${image.beachSlug}`);
      }

      await transaction.beachImage.create({
        data: { beachId, ...toSeedImageData(image) },
      });
    }
  });

  console.log(`Seeded ${seedBeachImages.length} beach images.`);
}
