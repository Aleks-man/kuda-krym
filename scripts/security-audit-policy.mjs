export function reviewAudit(report, policy, lockfile) {
  if (report.error || !report.vulnerabilities) {
    throw new Error("npm audit failed to produce a vulnerability report");
  }

  const allowedPackages = new Set(policy.allowedPackages);
  const allowedAdvisories = new Set(policy.allowedAdvisories);
  const reviewedDevPackages = policy.reviewedDevPackages ?? {};
  const unexpectedPackages = [];
  const unexpectedAdvisories = new Set();
  const invalidDevExceptions = [];

  for (const [name, vulnerability] of Object.entries(report.vulnerabilities)) {
    const reviewedVersion = reviewedDevPackages[name];
    if (!allowedPackages.has(name) && !reviewedVersion) {
      unexpectedPackages.push(name);
    }
    if (reviewedVersion) {
      const nodes = vulnerability.nodes ?? [];
      if (nodes.length === 0 || nodes.some((node) => {
        const entry = lockfile.packages?.[node];
        return entry?.dev !== true || entry.version !== reviewedVersion;
      })) {
        invalidDevExceptions.push(name);
      }
    }
    for (const advisory of vulnerability.via) {
      if (typeof advisory === "object" && !allowedAdvisories.has(advisory.source)) {
        unexpectedAdvisories.add(advisory.source);
      }
    }
  }

  return {
    unexpectedPackages,
    unexpectedAdvisories: [...unexpectedAdvisories],
    invalidDevExceptions,
  };
}
