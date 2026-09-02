import path from "node:path";
import { fileURLToPath } from "node:url";

const placeImageUrlPattern = /^\/images\/places\/[a-z0-9][a-z0-9-]*\.webp$/;
const publicDirectory = fileURLToPath(
  new URL("../../../../apps/web/public/", import.meta.url),
);

export function resolvePlaceImagePath(localUrl: string): string {
  if (!placeImageUrlPattern.test(localUrl)) {
    throw new Error(`Unsafe place image URL: ${localUrl}`);
  }

  const relativePath = localUrl.slice(1).split("/").join(path.sep);
  const targetPath = path.resolve(publicDirectory, relativePath);
  const allowedDirectory = `${path.resolve(publicDirectory, "images", "places")}${path.sep}`;

  if (!targetPath.startsWith(allowedDirectory)) {
    throw new Error(`Place image path escapes its output directory: ${localUrl}`);
  }

  return targetPath;
}
