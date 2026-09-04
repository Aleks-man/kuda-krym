import { test } from "@playwright/test";

import { expectPageAccessible } from "./support/expect-page-accessible";

const publicPages = [
  { name: "home", path: "/" },
  { name: "beach catalog", path: "/beaches" },
  { name: "beach details", path: "/beaches/popovka" },
  { name: "coastal catalog", path: "/coast" },
  { name: "coastal forecast", path: "/coast/yalta" },
] as const;

for (const publicPage of publicPages) {
  test(`${publicPage.name} has no automatically detectable WCAG violations`, async ({
    page,
  }) => {
    await page.goto(publicPage.path);
    await expectPageAccessible(page);
  });
}
