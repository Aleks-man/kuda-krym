import type { NextConfig } from "next";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: repositoryRoot,
  reactStrictMode: true,
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
};

export default nextConfig;

