import { execFileSync } from "node:child_process";

import type { FullConfig } from "@playwright/test";

import { getE2eDatabaseEnvironment } from "./e2e-database";

export default function globalSetup(_config: FullConfig): void {
  const environment = getE2eDatabaseEnvironment();

  runDatabaseScript("migrate:deploy", environment);
  runDatabaseScript("seed", environment);
}

function runDatabaseScript(
  script: "migrate:deploy" | "seed",
  environment: NodeJS.ProcessEnv,
): void {
  const npmExecutable = process.env.npm_execpath;
  if (!npmExecutable) {
    throw new Error("npm_execpath is required to prepare the E2E database");
  }

  execFileSync(
    process.execPath,
    [
      npmExecutable,
      "run",
      script,
      "--workspace",
      "@kuda-krym/database",
    ],
    {
      env: environment,
      stdio: "inherit",
    },
  );
}
