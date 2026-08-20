-- CreateEnum
CREATE TYPE "Region" AS ENUM ('WEST_CRIMEA', 'SOUTH_COAST', 'EAST_CRIMEA', 'SEVASTOPOL', 'KERCH_PENINSULA');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'DISABLED');

-- CreateEnum
CREATE TYPE "OsmType" AS ENUM ('NODE', 'WAY', 'RELATION');

-- CreateEnum
CREATE TYPE "Surface" AS ENUM ('UNKNOWN', 'SAND', 'PEBBLE', 'MIXED', 'ROCK');

-- CreateEnum
CREATE TYPE "WaterEntry" AS ENUM ('UNKNOWN', 'GENTLE', 'MODERATE', 'STEEP');

-- CreateEnum
CREATE TYPE "ChildSuitability" AS ENUM ('UNKNOWN', 'SUITABLE', 'LIMITED', 'UNSUITABLE');

-- CreateEnum
CREATE TYPE "InfrastructureLevel" AS ENUM ('UNKNOWN', 'NONE', 'BASIC', 'DEVELOPED');

-- CreateEnum
CREATE TYPE "ParkingType" AS ENUM ('UNKNOWN', 'NONE', 'REMOTE', 'NEARBY', 'ON_SITE');

-- CreateEnum
CREATE TYPE "AccessibilityLevel" AS ENUM ('UNKNOWN', 'LIMITED', 'ACCESSIBLE');

-- CreateEnum
CREATE TYPE "BayProtection" AS ENUM ('UNKNOWN', 'OPEN', 'PARTIAL', 'PROTECTED');

-- CreateEnum
CREATE TYPE "ExposureLevel" AS ENUM ('UNKNOWN', 'LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('UNKNOWN', 'YES', 'NO');

-- CreateEnum
CREATE TYPE "DataSourceType" AS ENUM ('OFFICIAL_REGISTRY', 'OPENSTREETMAP', 'WIKIMEDIA_COMMONS', 'OWNER_PROVIDED', 'FIELD_CHECK', 'EDITORIAL_RESEARCH');

-- CreateEnum
CREATE TYPE "BeachField" AS ENUM ('NAME', 'OFFICIAL_NAME', 'REGION', 'LOCALITY', 'COORDINATES', 'SURFACE', 'WATER_ENTRY', 'CHILD_SUITABILITY', 'INFRASTRUCTURE', 'PARKING', 'ACCESSIBILITY', 'BAY_PROTECTION', 'COASTLINE_BEARING', 'WIND_EXPOSURE', 'WAVE_EXPOSURE', 'HAS_TOILET', 'HAS_SHOWER', 'HAS_CHANGING_ROOM');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('IMPORTED', 'MANUALLY_CHECKED', 'CONFLICTING', 'STALE', 'REJECTED');

-- CreateTable
CREATE TABLE "beaches" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "officialName" TEXT,
    "region" "Region" NOT NULL,
    "locality" TEXT,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "osmType" "OsmType",
    "osmId" BIGINT,
    "officialRegistryId" TEXT,
    "description" TEXT,
    "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beach_profiles" (
    "beachId" UUID NOT NULL,
    "surface" "Surface" NOT NULL DEFAULT 'UNKNOWN',
    "waterEntry" "WaterEntry" NOT NULL DEFAULT 'UNKNOWN',
    "childSuitability" "ChildSuitability" NOT NULL DEFAULT 'UNKNOWN',
    "infrastructure" "InfrastructureLevel" NOT NULL DEFAULT 'UNKNOWN',
    "parking" "ParkingType" NOT NULL DEFAULT 'UNKNOWN',
    "accessibility" "AccessibilityLevel" NOT NULL DEFAULT 'UNKNOWN',
    "bayProtection" "BayProtection" NOT NULL DEFAULT 'UNKNOWN',
    "coastlineBearing" INTEGER,
    "windExposure" "ExposureLevel" NOT NULL DEFAULT 'UNKNOWN',
    "waveExposure" "ExposureLevel" NOT NULL DEFAULT 'UNKNOWN',
    "hasToilet" "Availability" NOT NULL DEFAULT 'UNKNOWN',
    "hasShower" "Availability" NOT NULL DEFAULT 'UNKNOWN',
    "hasChangingRoom" "Availability" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beach_profiles_pkey" PRIMARY KEY ("beachId")
);

-- CreateTable
CREATE TABLE "data_sources" (
    "id" UUID NOT NULL,
    "type" "DataSourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "license" TEXT,
    "retrievedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beach_field_evidence" (
    "id" UUID NOT NULL,
    "beachId" UUID NOT NULL,
    "field" "BeachField" NOT NULL,
    "sourceId" UUID NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'IMPORTED',
    "verifiedAt" TIMESTAMP(3),
    "note" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beach_field_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beach_images" (
    "id" UUID NOT NULL,
    "beachId" UUID NOT NULL,
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

    CONSTRAINT "beach_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beaches_slug_key" ON "beaches"("slug");

-- CreateIndex
CREATE INDEX "beaches_publicationStatus_idx" ON "beaches"("publicationStatus");

-- CreateIndex
CREATE INDEX "beaches_region_idx" ON "beaches"("region");

-- CreateIndex
CREATE UNIQUE INDEX "beaches_osmType_osmId_key" ON "beaches"("osmType", "osmId");

-- CreateIndex
CREATE INDEX "beach_profiles_surface_idx" ON "beach_profiles"("surface");

-- CreateIndex
CREATE INDEX "beach_profiles_childSuitability_idx" ON "beach_profiles"("childSuitability");

-- CreateIndex
CREATE INDEX "data_sources_type_idx" ON "data_sources"("type");

-- CreateIndex
CREATE INDEX "beach_field_evidence_beachId_field_idx" ON "beach_field_evidence"("beachId", "field");

-- CreateIndex
CREATE INDEX "beach_field_evidence_sourceId_idx" ON "beach_field_evidence"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "beach_field_evidence_beachId_field_sourceId_key" ON "beach_field_evidence"("beachId", "field", "sourceId");

-- CreateIndex
CREATE INDEX "beach_images_beachId_sortOrder_idx" ON "beach_images"("beachId", "sortOrder");

-- AddForeignKey
ALTER TABLE "beach_profiles" ADD CONSTRAINT "beach_profiles_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "beaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beach_field_evidence" ADD CONSTRAINT "beach_field_evidence_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "beaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beach_field_evidence" ADD CONSTRAINT "beach_field_evidence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "data_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beach_images" ADD CONSTRAINT "beach_images_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "beaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
