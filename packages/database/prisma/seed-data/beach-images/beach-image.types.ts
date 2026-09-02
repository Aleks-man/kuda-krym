export const supportedImageLicenses = [
  "CC BY 4.0",
  "CC BY-SA 4.0",
  "CC BY-SA 3.0",
  "Public domain",
] as const;

export type SupportedImageLicense = (typeof supportedImageLicenses)[number];

export type SeedBeachImage = Readonly<{
  beachSlug: string;
  localUrl: `/images/beaches/${string}.webp`;
  downloadUrl:
    | `https://upload.wikimedia.org/${string}`
    | `https://commons.wikimedia.org/wiki/Special:Redirect/file/${string}`;
  sourceUrl: `https://commons.wikimedia.org/wiki/File:${string}`;
  title: string;
  author: string;
  license: SupportedImageLicense;
  licenseUrl: `https://creativecommons.org/${string}` | null;
  alt: string;
  sourceVerifiedAt: string;
  isCover: boolean;
  sortOrder: number;
}>;
