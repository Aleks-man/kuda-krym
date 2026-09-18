import assert from "node:assert/strict";
import test from "node:test";
import { getE2eDatabaseEnvironment } from "./e2e-database.ts";

test("E2E overrides both inherited database addresses", () => {
  const testUrl = "postgresql://postgres:postgres@localhost:5432/app_e2e";
  const environment = getE2eDatabaseEnvironment({
    NODE_ENV: "test",
    E2E_DATABASE_URL: testUrl,
    DATABASE_URL: "postgresql://example.com/production",
    DIRECT_URL: "postgresql://example.com/production",
  });
  assert.equal(environment.DATABASE_URL, testUrl);
  assert.equal(environment.DIRECT_URL, testUrl);
});

test("E2E sets DIRECT_URL explicitly so dotenv cannot supply an external database", () => {
  const environment = getE2eDatabaseEnvironment({ NODE_ENV: "test" });
  assert.equal(new URL(environment.DIRECT_URL!).pathname, "/kuda_krym_e2e");
  assert.equal(environment.DIRECT_URL, environment.DATABASE_URL);
});

test("E2E refuses a non-test database and encoded suffix bypasses", () => {
  for (const url of [
    "postgresql://localhost/production",
    "postgresql://localhost/app_e2e%2Fproduction",
    "https://localhost/app_e2e",
  ]) {
    assert.throws(() => getE2eDatabaseEnvironment({ NODE_ENV: "test", E2E_DATABASE_URL: url }));
  }
});
