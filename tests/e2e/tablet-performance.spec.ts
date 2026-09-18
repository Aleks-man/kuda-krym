import { expect, test } from "@playwright/test";

for (const path of ["/beaches", "/coast"]) {
  test(`${path} keeps tablet cards rendered and serves prepared photographs`, async ({ page, request }) => {
    await page.route("https://api-maps.yandex.ru/**", route => {
      return route.abort();
    });
    await page.goto(path);
    const cards = path === "/beaches"
      ? page.getByRole("article")
      : page.locator('section[aria-labelledby="coast-list-title"] li > a');
    await expect(cards.first()).toBeVisible();
    await cards.last().scrollIntoViewIfNeeded();
    await expect(cards.last()).toBeVisible();
    expect(await cards.last().evaluate(element => getComputedStyle(element).contentVisibility))
      .toBe("visible");
    const photograph = cards.last().locator("img");
    await expect.poll(() => photograph.evaluate(image => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    const src = await photograph.evaluate(image => (image as HTMLImageElement).currentSrc);
    expect(src).toContain("/images/generated/");
    const response = await request.get(src);
    expect(response.ok()).toBe(true);
    expect(response.headers()["cache-control"]).toContain("immutable");
    await expect(page.getByRole("button", { name: /^Показать карту:/ })).toHaveCount(0);
    // The map frame must not overflow the tablet viewport.
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("map loads automatically and handles an unavailable provider", async ({ page }) => {
  test.skip(!process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY, "Build with the E2E map key to exercise provider failure");
  await page.route("https://api-maps.yandex.ru/**", route => route.abort());
  const failedProvider = page.waitForEvent("requestfailed", request =>
    request.url().startsWith("https://api-maps.yandex.ru/"),
  );
  await page.goto("/coast");
  await failedProvider;
  await expect(page.getByText("Карта временно недоступна", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Показать карту:/ })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Все прибрежные локации" })).toBeVisible();
});

test("tablet header avoids backdrop blur", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Tablet rendering policy");
  await page.goto("/");
  const headerPanel = page.locator("header").first().locator("div").first();
  expect(await headerPanel.evaluate(element => getComputedStyle(element).backdropFilter)).toBe("none");
});

test("map provider is requested once and initializes without interaction", async ({ page }) => {
  test.skip(!process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY, "Build with the E2E map key to exercise provider loading");
  let requests = 0;
  await page.route("https://api-maps.yandex.ru/**", async route => {
    requests += 1;
    await route.fulfill({
      contentType: "application/javascript",
      body: `window.ymaps = {
        ready: callback => callback(),
        Map: class {
          constructor(container) {
            container.setAttribute("data-map-ready", "true");
            this.behaviors = { disable() {} };
            this.geoObjects = { add() {} };
          }
          destroy() {}
          setBounds() {}
        },
        Placemark: class {},
        Polyline: class {},
        Clusterer: class { add() {} }
      };`,
    });
  });
  await page.goto("/beaches");
  await expect(page.locator('[data-map-ready="true"]')).toBeVisible();
  expect(requests).toBe(1);
  await expect(page.getByText("Загружаем карту…", { exact: true })).toHaveCount(0);
});
