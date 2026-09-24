import { cityCoverImages } from "@kuda-krym/contracts";
import type { LicensedImageAsset } from "./licensed-image.types.js";

export const cityImageAssets = Object.values(cityCoverImages).map((image): LicensedImageAsset => ({
  localUrl: image.url,
  downloadUrl: `https://commons.wikimedia.org/wiki/Special:Redirect/file/${image.sourceUrl.slice("https://commons.wikimedia.org/wiki/File:".length)}?width=1600`,
  sourceUrl: image.sourceUrl,
  title: image.title,
  author: image.author,
  license: image.license,
  licenseUrl: image.licenseUrl,
  sourceVerifiedAt: image.sourceVerifiedAt,
}));
