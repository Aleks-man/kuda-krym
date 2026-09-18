import { expect, test } from "@playwright/test";

const previewBots = [
  "TelegramBot",
  "TelegramBot (like TwitterBot)",
  "WhatsApp/2.0",
  "facebookexternalhit/1.1",
];

for (const userAgent of previewBots) {
  test(`home and coast provide complete previews without JavaScript for ${userAgent}`, async ({ request, page }) => {
    const images: string[] = [];
    for (const pathname of ["/", "/coast"]) {
      const response = await request.get(pathname, { headers: { "user-agent": userAgent } });
      expect(response.status()).toBe(200);
      const html = await response.text();
      const headEnd = html.indexOf("</head>");
      expect(headEnd).toBeGreaterThan(0);
      // Parse only the raw response head: a messenger cannot rely on hydration.
      const meta = await page.evaluate(head => {
        const document = new DOMParser().parseFromString(head, "text/html");
        const content = (key: string) =>
          document.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute("content");
        return {
          title: content("og:title"),
          description: content("og:description"),
          image: content("og:image"),
          twitterImage: content("twitter:image"),
          width: content("og:image:width"),
          height: content("og:image:height"),
          imageCount: document.querySelectorAll('meta[property="og:image"]').length,
          url: content("og:url"),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        };
      }, html.slice(0, headEnd + 7));
      expect(meta.title).toBeTruthy();
      expect(meta.description!.length).toBeGreaterThan(20);
      expect(meta.imageCount).toBe(1);
      expect(meta.image).toMatch(/^https?:\/\//);
      expect(meta.twitterImage).toBe(meta.image);
      expect(meta.width).toBe("1200");
      expect(meta.height).toBe("630");
      expect(meta.url).toBe(meta.canonical);
      expect(new URL(meta.url!).pathname).toBe(pathname);
      if (pathname === "/") {
        expect(meta.title).toContain("Куда поехать к морю в Крыму");
        expect(meta.description).toContain("Подбор пляжей Крыма");
      }
      images.push(meta.image!);
    }
    expect(images[0]).toBe(images[1]);
    const imageUrl = new URL(images[0]);
    expect(imageUrl.pathname).toBe("/opengraph-image");
    expect(imageUrl.search).toBe("");
    const image = await request.get(imageUrl.pathname, { headers: { "user-agent": userAgent } });
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    const png = await image.body();
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
}
