import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repositoryRoot = new URL("../../", import.meta.url);

test("keeps production migration and bootstrap commands separate", async () => {
  const rootPackage = await readJson("package.json");
  const databasePackage = await readJson("packages/database/package.json");

  assert.equal(
    rootPackage.scripts["database:migrate"],
    "npm run migrate:deploy --workspace @kuda-krym/database",
  );
  assert.equal(
    rootPackage.scripts["database:bootstrap"],
    "npm run bootstrap --workspace @kuda-krym/database",
  );
  assert.equal(databasePackage.scripts.deploy, "prisma migrate deploy");
  assert.equal(
    databasePackage.scripts.bootstrap,
    "prisma migrate deploy && prisma db seed",
  );
});

test("documents every public release command", async () => {
  const checklist = await readFile(
    new URL("docs/deployment/release-checklist.md", repositoryRoot),
    "utf8",
  );

  for (const command of [
    "check:release-config",
    "database:migrate",
    "database:bootstrap",
    "check:deployment",
  ]) {
    assert.match(checklist, new RegExp(`npm run ${command}`, "u"));
  }
});

async function readJson(pathname) {
  return JSON.parse(
    await readFile(new URL(pathname, repositoryRoot), "utf8"),
  );
}
