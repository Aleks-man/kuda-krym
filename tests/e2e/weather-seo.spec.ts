import { expect, test } from "@playwright/test";

test("city forecasts have crawlable links in the catalog", async ({ page }) => {
  await page.route("https://api-maps.yandex.ru/**", route => route.abort());
  await page.goto("/coast");
  const cities = page.locator('section[aria-labelledby="city-list-title"]');
  await expect(cities.getByRole("link")).toHaveCount(13);
  await cities.getByRole("link", { name: "Погода: Симферополь", exact: true }).click();
  await expect(page).toHaveURL(/\/cities\/simferopol$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Погода: Симферополь");
});
for (const [path, name] of [["/cities/simferopol", "Симферополь"], ["/coast/yalta", "Ялта"]] as const) {
  test(`${path} serves SEO metadata and the original forecast without JavaScript`, async ({ browser, baseURL, request }) => {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).not.toContain("daily-forecast-title");
    expect(html).toContain("forecast-location-info-title");
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    try {
      const page = await context.newPage();
      await page.goto(`${baseURL}${path}`);
      await expect(page).toHaveTitle(`Погода: ${name} — сегодня и на 7 дней | Куда.Крым`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(path + "$"));
      await expect(page.locator('section[aria-labelledby="daily-forecast-title"]')).toHaveCount(0);
      await expect(page.getByRole("region", { name: "Погода сейчас", exact: true })).toBeVisible();
      await expect(page.locator("#forecast-days-timeline")).toBeVisible();
      for (const width of [320, 390, 768, 1024, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    } finally { await context.close(); }
  });
}

test("forecast explanation uses the same dark description style as nearby beaches", async ({ page }) => {
  await page.goto("/coast/alushta");
  const info = page.locator('section[aria-labelledby="forecast-location-info-title"]');
  const reference = page.locator('section[aria-labelledby="nearby-beaches-title"] > p');
  await expect(info).toBeVisible();
  await expect(reference).toBeVisible();
  const expectedStyle = await reference.evaluate(element => {
    const style = getComputedStyle(element);
    return { color: style.color, fontWeight: style.fontWeight, fontSize: style.fontSize, lineHeight: style.lineHeight, opacity: style.opacity };
  });
  for (const paragraph of await info.locator("p").all()) {
    expect(await paragraph.evaluate(element => {
      const style = getComputedStyle(element);
      return { color: style.color, fontWeight: style.fontWeight, fontSize: style.fontSize, lineHeight: style.lineHeight, opacity: style.opacity };
    })).toEqual(expectedStyle);
  }
  await info.scrollIntoViewIfNeeded();
  await info.screenshot({ path: test.info().outputPath("forecast-explanation.png") });
});
