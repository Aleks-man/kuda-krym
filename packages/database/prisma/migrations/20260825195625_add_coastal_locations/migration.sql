-- CreateEnum
CREATE TYPE "WaterBody" AS ENUM ('BLACK_SEA', 'AZOV_SEA', 'KERCH_STRAIT');

-- AlterTable
ALTER TABLE "beaches" ADD COLUMN     "coastalLocationId" UUID;

-- CreateTable
CREATE TABLE "coastal_locations" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "waterBody" "WaterBody" NOT NULL,
    "weatherLatitude" DECIMAL(9,6) NOT NULL,
    "weatherLongitude" DECIMAL(9,6) NOT NULL,
    "marineLatitude" DECIMAL(9,6) NOT NULL,
    "marineLongitude" DECIMAL(9,6) NOT NULL,
    "coastlineBearing" INTEGER,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Moscow',
    "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coastal_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coastal_locations_slug_key" ON "coastal_locations"("slug");

-- CreateIndex
CREATE INDEX "coastal_locations_publicationStatus_idx" ON "coastal_locations"("publicationStatus");

-- CreateIndex
CREATE INDEX "coastal_locations_region_idx" ON "coastal_locations"("region");

-- CreateIndex
CREATE INDEX "coastal_locations_waterBody_idx" ON "coastal_locations"("waterBody");

-- CreateIndex
CREATE INDEX "beaches_coastalLocationId_idx" ON "beaches"("coastalLocationId");

-- AddForeignKey
ALTER TABLE "beaches" ADD CONSTRAINT "beaches_coastalLocationId_fkey" FOREIGN KEY ("coastalLocationId") REFERENCES "coastal_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
