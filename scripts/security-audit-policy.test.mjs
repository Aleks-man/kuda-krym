import assert from "node:assert/strict";
import test from "node:test";
import { reviewAudit } from "./security-audit-policy.mjs";

const policy = {
  allowedPackages: [],
  allowedAdvisories: [1240992],
  reviewedDevPackages: { braces: "3.0.3" },
};
function fixture() {
  return {
    report: { vulnerabilities: { braces: {
      nodes: ["node_modules/braces"],
      via: [{ source: 1240992 }],
    } } },
    lockfile: { packages: { "node_modules/braces": { dev: true, version: "3.0.3" } } },
  };
}
const accepted = { unexpectedPackages: [], unexpectedAdvisories: [], invalidDevExceptions: [] };

test("accepts only the reviewed development dependency version", () => {
  const { report, lockfile } = fixture();
  assert.deepEqual(reviewAudit(report, policy, lockfile), accepted);
  lockfile.packages["node_modules/braces"].version = "3.0.2";
  assert.deepEqual(reviewAudit(report, policy, lockfile).invalidDevExceptions, ["braces"]);
});

test("rejects a production copy even when another copy is dev-only", () => {
  const { report, lockfile } = fixture();
  report.vulnerabilities.braces.nodes.push("node_modules/another/node_modules/braces");
  lockfile.packages["node_modules/another/node_modules/braces"] = { version: "3.0.3" };
  assert.deepEqual(reviewAudit(report, policy, lockfile).invalidDevExceptions, ["braces"]);
});

test("rejects missing lock entries and empty node lists", () => {
  const { report, lockfile } = fixture();
  delete lockfile.packages["node_modules/braces"];
  assert.deepEqual(reviewAudit(report, policy, lockfile).invalidDevExceptions, ["braces"]);
  report.vulnerabilities.braces.nodes = [];
  assert.deepEqual(reviewAudit(report, policy, lockfile).invalidDevExceptions, ["braces"]);
});

test("rejects new advisories and unreviewed affected packages", () => {
  const { report, lockfile } = fixture();
  report.vulnerabilities.braces.via.push({ source: 9999999 });
  report.vulnerabilities.other = { via: ["braces"] };
  const result = reviewAudit(report, policy, lockfile);
  assert.deepEqual(result.unexpectedAdvisories, [9999999]);
  assert.deepEqual(result.unexpectedPackages, ["other"]);
});

test("fails closed on audit service errors or malformed reports", () => {
  assert.throws(() => reviewAudit({ error: { code: "ENOAUDIT" } }, policy, {}));
  assert.throws(() => reviewAudit({}, policy, {}));
  assert.deepEqual(reviewAudit({ vulnerabilities: {} }, policy, {}), accepted);
});
