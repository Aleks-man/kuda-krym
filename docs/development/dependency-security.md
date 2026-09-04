# Dependency security

Run the reviewed dependency audit from the repository root:

```powershell
npm run audit:security
```

The command fails when npm reports a package or advisory that is not listed in
`config/security-audit-policy.json`. The policy contains narrow temporary
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
