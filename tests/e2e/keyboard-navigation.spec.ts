import { expect, test } from "@playwright/test";

test("skips repeated navigation and identifies the current section", async ({
  page,
}) => {
  await page.goto("/beaches");

  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", {
    name: "Перейти к основному содержимому",
  });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  await expect(page.getByRole("link", { name: "Пляжи", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    page.getByRole("link", { name: "Побережье", exact: true }),
  ).not.toHaveAttribute("aria-current", "page");
});
