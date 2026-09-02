-- CreateTable
CREATE TABLE "coastal_location_images" (
    "id" UUID NOT NULL,
    "coastalLocationId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "title" TEXT,
    "author" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "licenseUrl" TEXT,
    "alt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coastal_location_images_pkey" PRIMARY KEY ("id")
);

-- Enforce valid image ordering.
ALTER TABLE "coastal_location_images"
ADD CONSTRAINT "coastal_location_images_sortOrder_nonnegative_check"
CHECK ("sortOrder" >= 0);

-- CreateIndex
CREATE INDEX "coastal_location_images_coastalLocationId_sortOrder_idx"
ON "coastal_location_images"("coastalLocationId", "sortOrder");

-- A coastal location can have only one cover image.
CREATE UNIQUE INDEX "coastal_location_images_one_cover_per_location"
ON "coastal_location_images"("coastalLocationId")
WHERE "isCover" = true;

-- AddForeignKey
ALTER TABLE "coastal_location_images"
ADD CONSTRAINT "coastal_location_images_coastalLocationId_fkey"
FOREIGN KEY ("coastalLocationId") REFERENCES "coastal_locations"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
