-- Enforce geographic ranges documented by the beach domain model.
ALTER TABLE "beaches"
ADD CONSTRAINT "beaches_latitude_range_check"
CHECK ("latitude" BETWEEN -90 AND 90),
ADD CONSTRAINT "beaches_longitude_range_check"
CHECK ("longitude" BETWEEN -180 AND 180);

-- Coastline bearing uses compass degrees and image ordering cannot be negative.
ALTER TABLE "beach_profiles"
ADD CONSTRAINT "beach_profiles_coastlineBearing_range_check"
CHECK ("coastlineBearing" IS NULL OR "coastlineBearing" BETWEEN 0 AND 359);

ALTER TABLE "beach_images"
ADD CONSTRAINT "beach_images_sortOrder_nonnegative_check"
CHECK ("sortOrder" >= 0);

-- A beach can have only one primary source for a field and one cover image.
CREATE UNIQUE INDEX "beach_field_evidence_one_primary_per_field"
ON "beach_field_evidence" ("beachId", "field")
WHERE "isPrimary" = true;

CREATE UNIQUE INDEX "beach_images_one_cover_per_beach"
ON "beach_images" ("beachId")
WHERE "isCover" = true;
