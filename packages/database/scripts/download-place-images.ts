import { downloadPlaceImage } from "./media/download-place-image.js";
import { collectPlaceImageAssets } from "./media/place-image-assets.js";
import { runWithConcurrency } from "./media/run-with-concurrency.js";

const argumentsSet = new Set(process.argv.slice(2));
const supportedArguments = new Set(["--dry-run", "--force"]);
const unknownArguments = [...argumentsSet].filter(
  (argument) => !supportedArguments.has(argument),
);

if (unknownArguments.length > 0) {
  throw new Error(`Unknown argument(s): ${unknownArguments.join(", ")}`);
}

const assets = collectPlaceImageAssets();

if (argumentsSet.has("--dry-run")) {
  console.log(`Found ${assets.length} unique place image asset(s).`);
} else {
  let downloaded = 0;
  let skipped = 0;

  await runWithConcurrency(assets, 4, async (asset) => {
    const result = await downloadPlaceImage(asset, argumentsSet.has("--force"));
    result.status === "downloaded" ? (downloaded += 1) : (skipped += 1);
    console.log(`${result.status}: ${result.localUrl}`);
  });

  console.log(`Place images ready: ${downloaded} downloaded, ${skipped} skipped.`);
}
