import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const policy = JSON.parse(
  readFileSync(new URL("../config/security-audit-policy.json", import.meta.url), "utf8"),
);
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("Run the dependency audit through `npm run audit:security`");
}

const audit = spawnSync(process.execPath, [npmCli, "audit", "--json"], {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});

if (audit.error) throw audit.error;

let report;

try {
  report = JSON.parse(audit.stdout);
} catch {
  throw new Error(`npm audit returned invalid JSON: ${audit.stderr.trim()}`);
}

const vulnerabilities = Object.entries(report.vulnerabilities ?? {});
const allowedPackages = new Set(policy.allowedPackages);
const allowedAdvisories = new Set(policy.allowedAdvisories);
const unexpectedPackages = vulnerabilities
  .map(([name]) => name)
  .filter((name) => !allowedPackages.has(name));
const unexpectedAdvisories = vulnerabilities
  .flatMap(([, vulnerability]) => vulnerability.via)
  .filter((item) => typeof item === "object")
  .map((advisory) => advisory.source)
  .filter((source) => !allowedAdvisories.has(source));

if (unexpectedPackages.length > 0 || unexpectedAdvisories.length > 0) {
  console.error("npm audit found vulnerabilities outside the reviewed policy", {
    unexpectedAdvisories: [...new Set(unexpectedAdvisories)],
    unexpectedPackages: [...new Set(unexpectedPackages)],
  });
  process.exitCode = 1;
} else if (vulnerabilities.length === 0) {
  console.log("npm audit found no known vulnerabilities.");
} else {
  console.log(
    `npm audit found only ${vulnerabilities.length} reviewed Prisma-related entries.`,
  );
}
