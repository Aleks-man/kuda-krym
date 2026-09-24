import { describe, expect, it } from "vitest";

import { createSitemap } from "./create-sitemap";

describe("sitemap", () => {
  it("contains public catalogs and every discoverable detail page", () => {
    const sitemap = createSitemap({
      siteUrl: new URL("https://kuda-krym.example"),
      beachSlugs: ["first-beach", "second-beach"],
      coastalLocationSlugs: ["yalta", "kerch"],
      citySlugs: ["simferopol", "bakhchisaray"],
    });

    expect(sitemap.map(({ url }) => url)).toEqual([
      "https://kuda-krym.example/",
      "https://kuda-krym.example/beaches",
      "https://kuda-krym.example/coast",
      "https://kuda-krym.example/cities/simferopol",
      "https://kuda-krym.example/cities/bakhchisaray",
      "https://kuda-krym.example/beaches/first-beach",
      "https://kuda-krym.example/beaches/second-beach",
      "https://kuda-krym.example/coast/yalta",
      "https://kuda-krym.example/coast/kerch",
    ]);
  });
});
