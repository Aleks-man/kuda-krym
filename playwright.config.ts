import { defineConfig, devices } from "@playwright/test";

import { getE2eDatabaseUrl } from "./tests/e2e/support/e2e-database";

const apiPort = 4100;
const webPort = 3100;
const upstreamPort = 4200;
const apiUrl = `http://127.0.0.1:${apiPort}`;
const webUrl = `http://127.0.0.1:${webPort}`;
const upstreamUrl = `http://127.0.0.1:${upstreamPort}`;
const databaseUrl = getE2eDatabaseUrl();

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/support/global-setup.ts",
  outputDir: "./test-results/e2e-artifacts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL: webUrl,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node tests/e2e/support/upstream-fixture-server.mjs",
      env: { PORT: upstreamPort.toString() },
      reuseExistingServer: false,
      timeout: 10_000,
      url: `${upstreamUrl}/health`,
    },
    {
      command: "npm run start --workspace @kuda-krym/api",
      env: {
        DATABASE_URL: databaseUrl,
        NODE_ENV: "production",
        PORT: apiPort.toString(),
        REDIS_URL: "redis://127.0.0.1:6399",
        WEB_ORIGIN: webUrl,
        WEATHER_BASE_URL: `${upstreamUrl}/v1/forecast`,
        MARINE_BASE_URL: `${upstreamUrl}/v1/marine`,
        WEATHER_MODEL_ECMWF_BASE_URL: `${upstreamUrl}/v1/ecmwf`,
        WEATHER_MODEL_DWD_BASE_URL: `${upstreamUrl}/v1/dwd-icon`,
        WEATHER_MODEL_GFS_BASE_URL: `${upstreamUrl}/v1/gfs`,
      },
      reuseExistingServer: false,
      timeout: 30_000,
      url: `${apiUrl}/api/health/ready`,
    },
    {
      command: `npm run start --workspace @kuda-krym/web -- --port ${webPort}`,
      env: {
        API_URL: apiUrl,
        NODE_ENV: "production",
      },
      reuseExistingServer: false,
      timeout: 30_000,
      url: webUrl,
    },
  ],
});
