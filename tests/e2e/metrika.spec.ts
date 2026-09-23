import { expect, test } from "@playwright/test";
import { recommendationResponseFixture } from "./fixtures/recommendation-response";

test("tracks production page transitions once and recommendation goals without contacting Yandex", async ({ page }) => {
  await page.route("https://kudakrym.ru/**", async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({ url: "http://127.0.0.1:3100" + url.pathname + url.search });
    await route.fulfill({ response });
  });
  let tagLoads = 0;
  await page.route("https://mc.yandex.ru/**", async route => {
    tagLoads++;
    await route.fulfill({ contentType: "application/javascript", body: `
      window.__metrikaCalls = [...(window.ym.a || [])];
      window.ym = (...args) => window.__metrikaCalls.push(args);
    ` });
  });
  await page.route("https://api-maps.yandex.ru/**", route => route.abort());
  await page.route("**/api/recommendations", route => route.fulfill({ json: recommendationResponseFixture }));
  await page.route("**/api/departure-locations?**", route => route.fulfill({ json: { data: [] } }));
  const calls = () => page.evaluate(() => (window as Window & { __metrikaCalls?: unknown[][] }).__metrikaCalls ?? []);
  await page.goto("https://kudakrym.ru/");
  await expect.poll(async () => (await calls()).filter(call => call[1] === "hit").length).toBe(1);
  await page.locator('header a[href="/coast"]').first().click();
  await expect(page).toHaveURL("https://kudakrym.ru/coast");
  await expect.poll(async () => (await calls()).filter(call => call[1] === "hit").length).toBe(2);
  await page.locator('header a[href="/"]').first().click();
  await expect.poll(async () => (await calls()).filter(call => call[1] === "hit").length).toBe(3);
  expect(tagLoads).toBe(1);
  expect((await calls()).filter(call => call[1] === "init")).toHaveLength(1);
  await page.getByRole("combobox", { name: "Откуда выезжаем" }).fill("Ялта");
  await page.getByRole("option", { name: /^Ялта/ }).first().click();
  await page.getByRole("combobox", { name: "Дата поездки" }).click();
  await page.getByRole("option", { name: /^Завтра,/ }).click();
  await page.getByRole("button", { name: "Подобрать пляж" }).click();
  await expect(page.getByRole("heading", { level: 4, name: "Ялта" })).toBeVisible();
  const goals = (await calls()).filter(call => call[1] === "reachGoal").map(call => call[2]);
  expect(goals).toEqual(["recommendation_submit", "recommendation_results"]);
  await page.unrouteAll({ behavior: "wait" });
});

test("does not load analytics on localhost", async ({ page }) => {
  const requests: string[] = [];
  await page.route("https://mc.yandex.ru/**", route => {
    requests.push(route.request().url());
    return route.abort();
  });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Подобрать пляж" })).toBeVisible();
  expect(await page.evaluate(() => Boolean((window as Window & { ym?: unknown }).ym))).toBe(false);
  expect(requests).toEqual([]);
});
