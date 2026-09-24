import type { NextConfig } from "next";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: repositoryRoot,
  reactStrictMode: true,
  images: {
    loader: "custom",
    loaderFile: "./src/shared/images/local-image-loader.ts",
    deviceSizes: [480, 768, 1024, 1280],
    imageSizes: [320, 640],
  },
  async headers() {
    return [
      {
        source: "/images/generated/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/images/:file",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;

