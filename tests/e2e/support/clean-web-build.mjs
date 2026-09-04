import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const supportDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(supportDirectory, "..", "..", "..");
const webBuildDirectory = path.resolve(repositoryRoot, "apps", "web", ".next");
const expectedBuildDirectory = path.join(repositoryRoot, "apps", "web", ".next");

if (webBuildDirectory !== expectedBuildDirectory) {
  throw new Error(`Refusing to remove unexpected directory: ${webBuildDirectory}`);
}

await rm(webBuildDirectory, { force: true, recursive: true });
