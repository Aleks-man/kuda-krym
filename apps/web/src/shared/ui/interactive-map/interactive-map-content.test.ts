import { describe, expect, it } from "vitest";

import { escapeMapHtml, getMapBounds } from "./interactive-map-content";

describe("interactive map content", () => {
  it("calculates bounds around every visible position", () => {
    expect(getMapBounds([
      [45.2, 34.4],
      [44.4, 33.5],
      [44.9, 35.1],
    ])).toEqual([
      [44.4, 33.5],
      [45.2, 35.1],
    ]);
  });

  it("escapes values inserted into Yandex Maps balloon HTML", () => {
    expect(escapeMapHtml(`<a href="/">Крым & море's</a>`)).toBe(
      "&lt;a href=&quot;/&quot;&gt;Крым &amp; море&#39;s&lt;/a&gt;",
    );
  });
});
