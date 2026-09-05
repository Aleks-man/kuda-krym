import assert from "node:assert/strict";
import test from "node:test";

import { parseEnvFile } from "./env-file.mjs";
import { validateProductionEnv } from "./production-env.mjs";

const validEnvironment = {
  DATABASE_URL: "postgresql://app:secret@postgres:5432/kuda_krym",
  SITE_URL: "https://kuda-krym.ru",
  WEB_ORIGIN: "https://kuda-krym.ru",
};

test("accepts a complete production environment", () => {
  assert.deepEqual(validateProductionEnv(validEnvironment), []);
});

test("rejects local origins and placeholder credentials", () => {
  const errors = validateProductionEnv({
    DATABASE_URL:
      "postgresql://app:replace-with-a-strong-password@postgres:5432/kuda_krym",
    SITE_URL: "http://localhost:3000",
    WEB_ORIGIN: "http://localhost:3000",
  });

  assert.ok(errors.includes("SITE_URL must use https in production"));
  assert.ok(errors.includes("WEB_ORIGIN must not point to localhost in production"));
  assert.ok(errors.some((error) => error.includes("placeholder value")));
});

test("requires matching public origins and a PostgreSQL database", () => {
  const errors = validateProductionEnv({
    ...validEnvironment,
    DATABASE_URL: "mysql://app:secret@database:3306/kuda_krym",
    WEB_ORIGIN: "https://www.kuda-krym.ru",
  });

  assert.ok(errors.includes("WEB_ORIGIN must match the public SITE_URL origin"));
  assert.ok(
    errors.includes("DATABASE_URL must use the postgresql or postgres protocol"),
  );
});

test("parses comments, whitespace and quoted values", () => {
  assert.deepEqual(
    parseEnvFile(`
      # production
      SITE_URL="https://kuda-krym.ru"
      WEB_ORIGIN = 'https://kuda-krym.ru'
    `),
    {
      SITE_URL: "https://kuda-krym.ru",
      WEB_ORIGIN: "https://kuda-krym.ru",
    },
  );
});
