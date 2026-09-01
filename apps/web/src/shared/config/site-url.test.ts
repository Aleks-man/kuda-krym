import { describe, expect, it } from "vitest";

import { parseSiteUrl } from "./site-url";

describe("site URL", () => {
  it("accepts a public HTTPS origin", () => {
    expect(parseSiteUrl("https://kuda-krym.example").href).toBe(
      "https://kuda-krym.example/",
    );
  });

  it.each([
    "ftp://kuda-krym.example",
    "https://user:secret@kuda-krym.example",
    "https://kuda-krym.example/catalog",
    "https://kuda-krym.example?preview=true",
    "https://kuda-krym.example#top",
  ])("rejects a value that is not a clean HTTP origin: %s", (value) => {
    expect(() => parseSiteUrl(value)).toThrow();
  });
});
