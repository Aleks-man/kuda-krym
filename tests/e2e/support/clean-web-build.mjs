import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const supportDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(supportDirectory, "..", "..", "..");
const webBuildDirectory = path.resolve(repositoryRoot, "apps", "web", ".next");
const expectedBuildDirectory = path.join(repositoryRoot, "apps", "web", ".next");

if (webBuildDirectory !== expectedBuildDirectory) {
  throw new Error("Refusing to remove unexpected directory: " + webBuildDirectory);
}

// Keep the running development server's artifacts intact.
const entries = await readdir(webBuildDirectory).catch((error) => {
  if (error.code === "ENOENT") return [];
  throw error;
});
for (const entry of entries) {
  if (entry === "dev") continue;
  const target = path.resolve(webBuildDirectory, entry);
  if (path.dirname(target) !== webBuildDirectory) {
    throw new Error("Refusing to remove unexpected path: " + target);
  }
  await rm(target, { force: true, recursive: true });
}
