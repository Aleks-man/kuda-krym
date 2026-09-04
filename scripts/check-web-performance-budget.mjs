import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const chunksDirectory = join("apps", "web", ".next", "static", "chunks");
const budgetPath = join("config", "web-performance-budget.json");

const budget = JSON.parse(await readFile(budgetPath, "utf8"));
const entries = await readdir(chunksDirectory, { recursive: true, withFileTypes: true });

const assetGroups = [
  { extension: ".js", label: "javascript", limits: budget.javascript },
  { extension: ".css", label: "stylesheets", limits: budget.stylesheets },
];

let hasExceededBudget = false;

for (const { extension, label, limits } of assetGroups) {
  const assets = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(extension),
  );
  const sizes = await Promise.all(
    assets.map(async (asset) => {
      const path = join(asset.parentPath, asset.name);
      const content = await readFile(path);

      return { path, bytes: content.byteLength };
    }),
  );
  const totalBytes = sizes.reduce((total, asset) => total + asset.bytes, 0);
  const largestAsset = sizes.toSorted((left, right) => right.bytes - left.bytes)[0];

  console.log(
    `${label}: ${formatBytes(totalBytes)} total, largest ${formatBytes(largestAsset?.bytes ?? 0)}`,
  );

  if (totalBytes > limits.maximumTotalBytes) {
    console.error(
      `${label} total exceeds ${formatBytes(limits.maximumTotalBytes)} budget.`,
    );
    hasExceededBudget = true;
  }

  if (largestAsset && largestAsset.bytes > limits.maximumAssetBytes) {
    console.error(
      `${largestAsset.path} exceeds ${formatBytes(limits.maximumAssetBytes)} asset budget.`,
    );
    hasExceededBudget = true;
  }
}

if (hasExceededBudget) {
  process.exitCode = 1;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}
