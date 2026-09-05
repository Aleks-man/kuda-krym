import { expect, test } from "@playwright/test";

test("navigates between a coastal forecast and its beach", async ({ page }) => {
  await page.goto("/coast/sudak");

  const nearbyBeaches = page.getByRole("region", {
    name: "Пляжи рядом",
  });
  await expect(nearbyBeaches).toBeVisible();

  const beachCard = nearbyBeaches.getByRole("article").filter({
    has: page.getByRole("heading", {
      name: "Центральный городской пляж Судака",
    }),
  });
  const beachLink = beachCard.getByRole("link", { name: "Подробнее" });
  await expect(beachLink).toHaveAttribute("href", "/beaches/sudak-central");
  await beachLink.click();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Центральный городской пляж Судака",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Прогноз для Судак" }),
  ).toHaveAttribute("href", "/coast/sudak");
});
