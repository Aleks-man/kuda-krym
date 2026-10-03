import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { reviewAudit } from "./security-audit-policy.mjs";

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

if (audit.status !== 0 && audit.status !== 1) {
  throw new Error(`npm audit failed: ${audit.stderr.trim()}`);
}

const lockfile = JSON.parse(
  readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
);
const review = reviewAudit(report, policy, lockfile);
const vulnerabilities = Object.keys(report.vulnerabilities);

if (Object.values(review).some((entries) => entries.length > 0)) {
  console.error("npm audit found vulnerabilities outside the reviewed policy", review);
  process.exitCode = 1;
} else if (vulnerabilities.length === 0) {
  console.log("npm audit found no known vulnerabilities.");
} else {
  console.log(
    `npm audit found only ${vulnerabilities.length} explicitly reviewed entries; known vulnerabilities remain (see docs/development/dependency-security.md).`,
  );
}
