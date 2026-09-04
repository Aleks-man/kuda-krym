import { expect, test } from "@playwright/test";

test("compares selected beaches and links to their details", async ({ page }) => {
  await page.goto("/compare?beaches=popovka,uchkuevka");

  await expect(
    page.getByRole("heading", { level: 1, name: "Сравнение пляжей" }),
  ).toBeVisible();

  const comparison = page.getByRole("table");
  await expect(comparison).toBeVisible();
  await expect(
    comparison.getByRole("columnheader", { name: /Пляж Поповка/ }),
  ).toBeVisible();
  await expect(
    comparison.getByRole("columnheader", { name: /Пляж Учкуевка/ }),
  ).toBeVisible();

  const detailLinks = comparison.getByRole("link", { name: "Открыть карточку →" });
  await expect(detailLinks).toHaveCount(2);
  await expect(detailLinks.nth(0)).toHaveAttribute("href", "/beaches/popovka");
  await expect(detailLinks.nth(1)).toHaveAttribute("href", "/beaches/uchkuevka");
});
