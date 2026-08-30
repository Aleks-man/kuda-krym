# E2E tests

Playwright scenarios for public user journeys live in this directory. Tests use
the production builds of the web application and API and a separate
`kuda_krym_e2e` PostgreSQL database.

Do not point `E2E_DATABASE_URL` at a development or production database because
the E2E setup applies migrations and replaces seed data.

## Covered journeys

- filtering the published beach catalog by region;
- loading coastal forecast locations grouped by region;
- submitting recommendation preferences and rendering a validated result.

External map tiles are blocked during catalog scenarios. The recommendation
scenario intercepts its API response so the smoke suite does not depend on
Open-Meteo or OSRM availability.

## Local run

Create the `kuda_krym_e2e` database in the local PostgreSQL instance, then run:

```powershell
npm run test:e2e:install
npm run test:e2e
```

The default connection is
`postgresql://postgres:postgres@127.0.0.1:5432/kuda_krym_e2e?schema=public`.
Set `E2E_DATABASE_URL` when the local credentials or port differ. The database
name must end with `_e2e`; otherwise the safety check stops the run.

Playwright builds both applications, applies migrations, replaces seed data,
starts the production API and web servers, and runs Chromium. Open the latest
HTML report with:

```powershell
npm run test:e2e:report
```
