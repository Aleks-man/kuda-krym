export const supportedImageLicenses = [
  "CC BY 4.0",
  "CC BY 3.0",
  "CC BY-SA 4.0",
  "CC BY-SA 3.0",
  "Public domain",
] as const;

export type SupportedImageLicense = (typeof supportedImageLicenses)[number];

export type LicensedImageAsset = Readonly<{
  localUrl: `/images/places/${string}.webp`;
  downloadUrl:
    | `https://upload.wikimedia.org/${string}`
    | `https://commons.wikimedia.org/wiki/Special:Redirect/file/${string}`;
  sourceUrl: `https://commons.wikimedia.org/wiki/File:${string}`;
  title: string;
  author: string;
  license: SupportedImageLicense;
  licenseUrl: `https://creativecommons.org/${string}` | null;
  sourceVerifiedAt: string;
}>;

export type SeedImagePlacement = Readonly<{
  alt: string;
  isCover: boolean;
  sortOrder: number;
}>;
