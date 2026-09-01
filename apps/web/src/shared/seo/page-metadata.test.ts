import { describe, expect, it } from "vitest";

import { createPageMetadata } from "./page-metadata";

describe("page metadata", () => {
  it("uses one clean path for canonical and Open Graph URLs", () => {
    const metadata = createPageMetadata({
      title: "Пляжи Крыма",
      description: "Каталог пляжей",
      pathname: "/beaches",
    });

    expect(metadata.alternates).toEqual({ canonical: "/beaches" });
    expect(metadata.openGraph).toMatchObject({
      locale: "ru_RU",
      siteName: "Куда.Крым",
      title: "Пляжи Крыма",
      url: "/beaches",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary" });
  });
});
