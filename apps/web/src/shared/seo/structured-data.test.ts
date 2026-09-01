import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "./json-ld";
import {
  createPlaceStructuredData,
  createWebsiteStructuredData,
} from "./structured-data";

describe("structured data", () => {
  it("describes the website using its public URL", () => {
    expect(
      createWebsiteStructuredData(new URL("https://kuda-krym.example")),
    ).toMatchObject({
      "@type": "WebSite",
      name: "Куда.Крым",
      inLanguage: "ru",
      url: "https://kuda-krym.example/",
    });
  });

  it("describes a place without adding unverified facts", () => {
    expect(
      createPlaceStructuredData({
        type: "TouristAttraction",
        name: "Проверенный пляж",
        description: "Описание пляжа",
        pathname: "/beaches/verified-beach",
        coordinates: { latitude: 44.5, longitude: 34.1 },
        siteUrl: new URL("https://kuda-krym.example"),
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: "Проверенный пляж",
      description: "Описание пляжа",
      url: "https://kuda-krym.example/beaches/verified-beach",
      geo: {
        "@type": "GeoCoordinates",
        latitude: 44.5,
        longitude: 34.1,
      },
    });
  });

  it("escapes markup before embedding JSON-LD into a script", () => {
    const serialized = serializeJsonLd({ name: "</script><script>alert(1)" });

    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
  });
});
