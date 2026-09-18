"use client";

import type { ImageLoaderProps } from "next/image";
import manifest from "../../generated/image-manifest.json";

type Variant = Readonly<{ width: number; url: string }>;
const images: Readonly<Record<string, readonly Variant[]>> = manifest;

export default function localImageLoader({ src, width }: ImageLoaderProps): string {
  // Brand marks are vectors and do not need raster variants.
  if (src.startsWith("/brand/") && src.endsWith(".svg")) return src;
  const variants = images[src];
  if (!variants?.length) {
    throw new Error(`Image not prepared: ${src}. Run npm run images:prepare --workspace @kuda-krym/web.`);
  }
  return (variants.find(variant => variant.width >= width) ?? variants[variants.length - 1]).url;
}
