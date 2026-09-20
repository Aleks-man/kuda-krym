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
for (const width of [1280, 320]) {
  test(`forecast card supports keyboard selection and catalog navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const card = page.getByRole("region", { name: "Прогноз по побережью", exact: true });
    await expect(card).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const search = card.getByRole("combobox", { name: "Населённый пункт" });
    await search.fill("Несуществующее место");
    await expect(card.getByText("Такой зоны прогноза пока нет")).toBeVisible();
    await search.press("Escape");
    await expect(search).toHaveAttribute("aria-expanded", "false");
    await search.fill("Ялта");
    await search.press("Enter");
    await expect(page).toHaveURL(/\/coast\/yalta$/);
    await page.goto("/");
    await card.getByRole("link", { name: "Все населённые пункты" }).click();
    await expect(page).toHaveURL(/\/coast$/);
  });
}
