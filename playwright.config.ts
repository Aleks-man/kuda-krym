import { defineConfig, devices } from "@playwright/test";

const apiPort = 4100;
const webPort = 3100;
const apiUrl = `http://127.0.0.1:${apiPort}`;
const webUrl = `http://127.0.0.1:${webPort}`;
const databaseUrl = process.env.E2E_DATABASE_URL
  ?? "postgresql://postgres:postgres@127.0.0.1:5432/kuda_krym_e2e?schema=public";

export default defineConfig({
  testDir: "./tests/e2e",
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
      command: "npm run start --workspace @kuda-krym/api",
      env: {
        DATABASE_URL: databaseUrl,
        NODE_ENV: "production",
        PORT: apiPort.toString(),
        REDIS_URL: "redis://127.0.0.1:6399",
        WEB_ORIGIN: webUrl,
      },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      url: `${apiUrl}/api/health/ready`,
    },
    {
      command: `npm run start --workspace @kuda-krym/web -- --port ${webPort}`,
      env: {
        API_URL: apiUrl,
        NODE_ENV: "production",
      },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      url: webUrl,
    },
  ],
});
