import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://*.tile.openstreetmap.org/**", (route) => route.abort());
});

test("opens a coastal location from the catalog", async ({ page }) => {
  await page.goto("/coast");

  await page.getByRole("link", { name: /Ялта/ }).click();

  await expect(page).toHaveURL(/\/coast\/yalta$/, { timeout: 20_000 });
  await expect(
    page.getByRole("heading", { level: 1, name: "Ялта" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Актуальные условия у моря: температура воздуха и воды, ветер, осадки и волны.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: /Ялт/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "← Всё побережье" })).toHaveAttribute(
    "href",
    "/coast",
  );
});
