import assert from "node:assert/strict";
import test from "node:test";

import { checkDeployment } from "./deployment-check.mjs";

test("passes all public application checks", async () => {
  const results = await checkDeployment({
    webUrl: "https://kuda-krym.ru",
    apiUrl: "https://api.kuda-krym.ru",
    fetchImpl: createFetchStub(),
  });

  assert.equal(results.length, 5);
  assert.ok(results.every((result) => result.ok));
});

test("reports an unavailable database", async () => {
  const results = await checkDeployment({
    webUrl: "https://kuda-krym.ru",
    apiUrl: "https://api.kuda-krym.ru",
    fetchImpl: createFetchStub({ databaseReady: false }),
  });

  assert.deepEqual(
    results.filter((result) => !result.ok).map((result) => result.name),
    ["API readiness"],
  );
});

test("requires origin-only deployment URLs", async () => {
  await assert.rejects(
    checkDeployment({
      webUrl: "https://kuda-krym.ru/coast",
      apiUrl: "https://api.kuda-krym.ru",
      fetchImpl: createFetchStub(),
    }),
    /webUrl must contain only an origin/u,
  );
});

function createFetchStub({ databaseReady = true } = {}) {
  return async (url) => {
    const pathname = new URL(url).pathname;

    if (pathname === "/") {
      return new Response("<!doctype html>", {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    if (pathname === "/robots.txt") {
      return new Response("User-Agent: *");
    }
    if (pathname === "/sitemap.xml") {
      return new Response("<urlset></urlset>");
    }
    if (pathname === "/api/health/live") {
      return Response.json({ status: "ok" });
    }

    return Response.json(
      {
        status: databaseReady ? "ready" : "not_ready",
        checks: { database: databaseReady ? "up" : "down" },
      },
      { status: databaseReady ? 200 : 503 },
    );
  };
}
