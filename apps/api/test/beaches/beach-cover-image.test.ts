import type { PlaceImage } from "@kuda-krym/contracts";
import { describe, expect, it } from "vitest";

import { selectBeachCoverImage } from "../../src/modules/beaches/beach-cover-image.js";

const beachImage: PlaceImage = {
  url: "/images/places/popovka-sunset-2007.webp",
  alt: "Popovka beach",
  title: "Popovka sunset",
  author: "Beach author",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Popovka.jpg",
};

const coastalImage: PlaceImage = {
  ...beachImage,
  url: "/images/places/evpatoria-beach-2021.webp",
  author: "Coastal author",
};

describe("selectBeachCoverImage", () => {
  it("prefers an exact beach image", () => {
    expect(selectBeachCoverImage([beachImage], [coastalImage])).toEqual({
      ...beachImage,
      context: "BEACH",
    });
  });

  it("falls back to the linked coastal location image", () => {
    expect(selectBeachCoverImage([], [coastalImage])).toEqual({
      ...coastalImage,
      context: "COASTAL_LOCATION",
    });
  });

  it("returns null when neither source has an image", () => {
    expect(selectBeachCoverImage([], [])).toBeNull();
  });
});
