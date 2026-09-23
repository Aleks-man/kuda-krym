import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import manifest from "../../generated/image-manifest.json";
import localImageLoader from "./local-image-loader";

const source = "/images/places/zaozernoe-sunset-2010.webp";

describe("prepared local images", () => {
  it("selects a sufficient width and caps Retina requests at the source size", () => {
    const variants = manifest[source];
    expect(localImageLoader({ src: source, width: 700 })).toBe(
      variants.find(variant => variant.width === 768)?.url,
    );
    expect(localImageLoader({ src: source, width: 2560 })).toBe(variants.at(-1)?.url);
  });

  it("keeps vector brand marks unchanged", () => {
    expect(localImageLoader({ src: "/brand/kuda-krym-mark.svg", width: 64 }))
      .toBe("/brand/kuda-krym-mark.svg");
  });

  it("rejects missing or remote photographs instead of producing broken variants", () => {
    expect(() => localImageLoader({ src: "/images/places/missing.webp", width: 480 }))
      .toThrow("Image not prepared");
    expect(() => localImageLoader({ src: "https://example.com/image.webp", width: 480 }))
      .toThrow("Image not prepared");
  });

  it("covers every source photograph with decodable, correctly sized immutable files", async () => {
    // Resolve from src/shared/images to the web package's public directory.
    const root = new URL("../../../public/", import.meta.url);
    const sourceFiles = (await readdir(new URL("images/places/", root)))
      .filter(name => name.endsWith(".webp"));
    expect(Object.keys(manifest)).toHaveLength(sourceFiles.length);
    for (const name of sourceFiles) {
      const variants = (manifest as Record<string, { width: number; url: string }[]>)[`/images/places/${name}`];
      expect(variants?.length).toBeGreaterThan(0);
      for (const variant of variants) {
        expect(variant.url).toMatch(/^\/images\/generated\/[a-f0-9]{20}-\d+\.webp$/);
        const path = fileURLToPath(new URL(variant.url.slice(1), root));
        const image = await sharp(await readFile(path)).metadata();
        expect(image.width).toBe(variant.width);
        expect(image.format).toBe("webp");
      }
    }
  }, 15_000);
});
