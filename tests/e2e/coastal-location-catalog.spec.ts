import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://*.tile.openstreetmap.org/**", (route) => route.abort());
});

test("shows the published coastal forecast locations by region", async ({
  page,
}) => {
  await page.goto("/coast");

  await expect(
    page.getByRole("heading", { level: 1, name: "Погода у моря в Крыму" }),
  ).toBeVisible();
  await expect(page.getByText("Зон прогноза: 36")).toBeVisible();

  const locationCatalog = page.locator(
    'section[aria-labelledby="coast-list-title"]',
  );

  await expect(locationCatalog.getByRole("listitem")).toHaveCount(36);
  await expect(
    locationCatalog.getByRole("heading", { level: 3, name: "Южный берег" }),
  ).toBeVisible();
  await expect(locationCatalog.getByRole("link", { name: /Ялта/ })).toHaveAttribute(
    "href",
    "/coast/yalta",
  );
});
