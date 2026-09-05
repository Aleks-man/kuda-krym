import { checkDeployment } from "./deployment-check.mjs";

const webUrl = process.env.DEPLOYMENT_WEB_URL;
const apiUrl = process.env.DEPLOYMENT_API_URL;

try {
  const results = await checkDeployment({ webUrl, apiUrl });

  for (const result of results) {
    const marker = result.ok ? "PASS" : "FAIL";
    console.log(`[${marker}] ${result.name}: ${result.url}`);
    if (result.error) {
      console.log(`       ${result.error}`);
    }
  }

  if (results.some((result) => !result.ok)) {
    process.exitCode = 1;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Cannot check deployment: ${message}`);
  console.error("Set DEPLOYMENT_WEB_URL and DEPLOYMENT_API_URL first.");
  process.exitCode = 1;
}
