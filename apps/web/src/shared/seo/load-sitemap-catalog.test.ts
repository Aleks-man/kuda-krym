import { describe, expect, it, vi } from "vitest";
import { loadSitemapCatalog } from "./load-sitemap-catalog";
import fallback from "./sitemap-catalog.json";
const live = async () => ({ data: [{ slug: "live-location" }] });
const failed = async () => { throw new Error("API unavailable"); };
describe("sitemap catalog resilience", () => {
  it("uses the current API catalog, including intentional empty catalogs", async () => {
    expect(await loadSitemapCatalog(live, async () => ({ data: [] }))).toEqual({ beachSlugs: ["live-location"], coastalLocationSlugs: [] });
  });
  it("keeps a successful source when the other API fails", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      expect(await loadSitemapCatalog(failed, live)).toEqual({ beachSlugs: fallback.beachSlugs, coastalLocationSlugs: ["live-location"] });
      expect(await loadSitemapCatalog(live, failed)).toEqual({ beachSlugs: ["live-location"], coastalLocationSlugs: fallback.coastalLocationSlugs });
    } finally { warning.mockRestore(); }
  });
  it("still supplies all bundled routes on a complete outage", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    try { expect(await loadSitemapCatalog(failed, failed)).toEqual(fallback); } finally { warning.mockRestore(); }
  });
});
