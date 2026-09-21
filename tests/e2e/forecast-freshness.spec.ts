import { expect, test } from "@playwright/test";

for (const path of ["/coast/yalta", "/beaches/popovka", "/cities/simferopol"]) {
  test(`loads a new forecast response on each visit to ${path}`, async ({ page }) => {
    await page.route("https://api-maps.yandex.ru/**", route => route.abort());
    await page.goto(path);
    const updated = page.locator('section[aria-labelledby="forecast-title"] > p time');
    await expect(updated).toBeVisible();
    const first = await updated.getAttribute("dateTime");
    await page.goto(path);
    await expect(updated).toBeVisible();
    await expect(updated).not.toHaveAttribute("dateTime", first!);
  });
}

test("refreshes an old forecast on return to the tab without reloading the document", async ({ page }) => {
  await page.route("https://api-maps.yandex.ru/**", route => route.abort());
  await page.goto("/coast/yalta");
  const updated = page.locator('section[aria-labelledby="forecast-title"] > p time');
  await expect(updated).toBeVisible();
  const first = await updated.getAttribute("dateTime");
  await page.clock.install();
  await page.clock.setFixedTime(new Date(Date.now() + 20 * 60_000));
  await page.evaluate(() => {
    (window as Window & { forecastRefreshMarker?: boolean }).forecastRefreshMarker = true;
    window.dispatchEvent(new Event("focus"));
  });
  await expect(updated).not.toHaveAttribute("dateTime", first!);
  expect(await page.evaluate(() => (window as Window & { forecastRefreshMarker?: boolean }).forecastRefreshMarker)).toBe(true);
});
