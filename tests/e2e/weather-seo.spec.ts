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
for (const [path, name, marine] of [["/cities/simferopol", "Симферополь", false], ["/coast/yalta", "Ялта", true]] as const) {
  test(`${path} serves SEO metadata and a forecast summary without JavaScript`, async ({ browser, baseURL, request }) => {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain("daily-forecast-title");
    expect(html).toContain("forecast-location-info-title");
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    try {
      const page = await context.newPage();
      await page.goto(`${baseURL}${path}`);
      await expect(page).toHaveTitle(`Погода: ${name} — сегодня и на 7 дней | Куда.Крым`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(path + "$"));
      const table = page.locator('section[aria-labelledby="daily-forecast-title"] table');
      await expect(table).toBeVisible();
      expect(await table.locator("tbody tr").count()).toBeGreaterThan(0);
      expect(await table.locator("tbody tr").count()).toBeLessThanOrEqual(7);
      await expect(table.getByRole("columnheader", { name: "Вода, средняя" })).toHaveCount(marine ? 1 : 0);
      for (const width of [320, 390, 768, 1024, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const forecast = page.locator('section[aria-labelledby="daily-forecast-title"]');
        expect(await forecast.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        expect(await table.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        const firstRow = table.locator("tbody tr").first();
        await expect(firstRow).toBeVisible();
        for (const cell of await firstRow.locator("td").all()) {
          expect(await cell.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        }
        if (width === 390 || width === 768) {
          await forecast.screenshot({ path: test.info().outputPath(`summary-${width}.png`) });
        }
      }
    } finally { await context.close(); }
  });
}
