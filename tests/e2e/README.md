# E2E tests

Playwright scenarios for public user journeys live in this directory. Tests use
the production builds of the web application and API and a separate
`kuda_krym_e2e` PostgreSQL database.

Do not point `E2E_DATABASE_URL` at a development or production database because
the E2E setup applies migrations and replaces seed data.

## Covered journeys

- filtering the published beach catalog by region;
- loading coastal forecast locations grouped by region;
- opening a coastal location from the catalog;
- rendering a two-day coastal forecast;
- rendering verified media and a two-day forecast on a beach page;
- submitting recommendation preferences and rendering a validated result;
- comparing selected beaches and opening their detail pages;
- detecting WCAG A/AA violations on key public pages;
- skipping repeated navigation with the keyboard and identifying the current section.

External map tiles are blocked during catalog scenarios. The recommendation
scenario intercepts its API response. Weather and marine scenarios use a local
upstream fixture server, so the smoke suite does not depend on Open-Meteo or
OSRM availability.

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
