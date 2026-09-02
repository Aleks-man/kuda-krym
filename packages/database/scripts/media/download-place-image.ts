import { mkdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { PlaceImageAsset } from "./place-image-assets.js";
import { resolvePlaceImagePath } from "./place-image-path.js";

const maximumDownloadBytes = 25 * 1024 * 1024;

export type DownloadResult = Readonly<{
  localUrl: string;
  status: "downloaded" | "skipped";
}>;

export async function downloadPlaceImage(
  asset: PlaceImageAsset,
  force: boolean,
): Promise<DownloadResult> {
  const targetPath = resolvePlaceImagePath(asset.localUrl);

  if (!force && (await sharpFileExists(targetPath))) {
    return { localUrl: asset.localUrl, status: "skipped" };
  }

  const source = await fetchImage(asset);
  const temporaryPath = `${targetPath}.${process.pid}.tmp`;

  await mkdir(path.dirname(targetPath), { recursive: true });

  try {
    await sharp(source)
      .rotate()
      .resize(1280, 800, { fit: "cover", position: "attention" })
      .webp({ effort: 4, quality: 82 })
      .toFile(temporaryPath);
    await rename(temporaryPath, targetPath);
  } finally {
    await rm(temporaryPath, { force: true });
  }

  return { localUrl: asset.localUrl, status: "downloaded" };
}

async function fetchImage(asset: PlaceImageAsset): Promise<Buffer> {
  const response = await fetch(asset.downloadUrl, {
    headers: { "User-Agent": "Kuda-Krym image asset downloader/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`${asset.title}: download failed with HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("image/")) {
    throw new Error(`${asset.title}: unexpected content type ${contentType || "unknown"}`);
  }

  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > maximumDownloadBytes) {
    throw new Error(`${asset.title}: image exceeds the download size limit`);
  }

  const source = Buffer.from(await response.arrayBuffer());
  if (source.byteLength > maximumDownloadBytes) {
    throw new Error(`${asset.title}: image exceeds the download size limit`);
  }

  return source;
}

async function sharpFileExists(filePath: string): Promise<boolean> {
  try {
    const file = await stat(filePath);
    if (!file.isFile()) return false;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return false;
    throw error;
  }

  await sharp(filePath).metadata();
  return true;
}
