# Dependency security

Run the reviewed dependency audit from the repository root:

```powershell
npm run audit:security
```

The command fails when npm reports a package or advisory that is not listed in
`config/security-audit-policy.json`. ESLint exceptions additionally require exact reviewed versions and dev-only entries
in the lockfile; a production copy fails the audit. The policy contains narrow temporary
exceptions, not severity-wide ignores.

## Reviewed Prisma exceptions

As of 2026-09-04, Prisma 7.9.1 brings three advisories through its CLI tooling:

- `GHSA-ggr8-5vv4-36mx` in `deepmerge-ts`;
- `GHSA-3f6p-5ww8-9rcr` in `mysql2`;
- `GHSA-rgwj-5xj2-c3m3` in `mysql2`.

The application uses PostgreSQL through `@prisma/adapter-pg`; it does not use
the bundled MySQL driver. Prisma Config reads the repository-owned
`prisma.config.ts` and is not exposed to public request data. These constraints
reduce exposure but do not make the advisories disappear, so they remain visible
and explicitly tracked.

The npm-proposed remediation downgrades Prisma to version 6, while Prisma 8 is
currently a release candidate requiring Node.js 22. Neither change is suitable
for an automated security fix. Revisit and remove the exceptions when a stable,
compatible Prisma release updates the affected dependencies.

Do not run `npm audit fix --force`; review dependency changes and verify the full
quality and E2E suites instead.

## Reviewed ESLint exception

As of 2026-10-03, `eslint-config-next@16.3.3` uses
`@next/eslint-plugin-next@16.3.3` -> `fast-glob@3.3.1` -> `micromatch@4.0.8`
-> `braces@3.0.3`. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
reports stack exhaustion on deeply nested brace patterns. No patched braces
release is available; the current Next ESLint plugin still uses fast-glob.

All five packages are development-only in the committed lockfile;
`npm ls braces --omit=dev` confirms no production dependency. ESLint receives
repository-controlled file patterns, not public weather request data. This is a
temporary tooling exception, not a fix for the underlying vulnerability.
The policy checks every reported installation path for `dev: true` and the exact
reviewed version. New advisories, versions, packages, or production copies fail.
Remove this exception when upstream ships a compatible fix. Do not feed untrusted
glob patterns to this toolchain.

`npm run test:security` covers these restrictions and audit service errors; it also
runs as part of `npm test` and `npm run check`. Run `npm run audit:security` separately
before pushing because it queries the live advisory database.
