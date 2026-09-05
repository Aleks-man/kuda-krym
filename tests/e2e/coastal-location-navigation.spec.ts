import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://*.tile.openstreetmap.org/**", (route) => route.abort());
});

test("opens a coastal location from the catalog", async ({ page }) => {
  await page.goto("/coast");

  const locationCatalog = page.locator(
    'section[aria-labelledby="coast-list-title"]',
  );
  await locationCatalog.getByRole("link", { name: /Ялта/ }).click();

  await expect(page).toHaveURL(/\/coast\/yalta$/, { timeout: 20_000 });

  const locationHero = page.locator("main > header").filter({
    has: page.getByRole("heading", { level: 1, name: "Ялта" }),
  });
  await expect(locationHero).toBeVisible();
  await expect(
    locationHero.getByText(
      "Актуальные условия у моря: температура воздуха и воды, ветер, осадки и волны.",
    ),
  ).toBeVisible();
  await expect(locationHero.getByRole("img", { name: /Ялт/ })).toBeVisible();
  await expect(
    locationHero.getByRole("link", { name: "← Всё побережье" }),
  ).toHaveAttribute("href", "/coast");
});
