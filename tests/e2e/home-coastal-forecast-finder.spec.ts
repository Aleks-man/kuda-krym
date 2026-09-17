import { expect, test } from "@playwright/test";

test("opens a coastal forecast from the home page search", async ({ page }) => {
  await page.goto("/");

  const search = page.getByRole("combobox", { name: "Населённый пункт" });
  await search.fill("Николаевка");
  await page.getByRole("option", { name: /Николаевка/ }).click();

  await expect(page).toHaveURL(/\/coast\/nikolaevka$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Николаевка" }),
  ).toBeVisible();
});