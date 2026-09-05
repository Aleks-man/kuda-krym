import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { parseEnvFile } from "./env-file.mjs";
import { validateProductionEnv } from "./production-env.mjs";

const envFilePath = resolve(process.argv[2] ?? ".env");

try {
  const environment = parseEnvFile(await readFile(envFilePath, "utf8"));
  const errors = validateProductionEnv(environment);

  if (errors.length > 0) {
    console.error("Production configuration is not ready:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Production configuration is valid: ${envFilePath}`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Cannot read production environment file: ${message}`);
  process.exitCode = 1;
}
