import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

export async function expectPageAccessible(page: Page) {
  // Check the settled page, not a partially transparent entrance-animation frame.
  // Infinite decorative animations must not prevent the accessibility audit.
  await page.evaluate(async () => {
    const finiteAnimations = document.getAnimations().filter(
      animation => animation.effect?.getComputedTiming().iterations !== Infinity,
    );
    await Promise.all(finiteAnimations.map(animation => animation.finished.catch(() => {})));
  });
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();

  expect(results.violations).toEqual([]);
}
