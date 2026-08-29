# E2E tests

Playwright scenarios for public user journeys live in this directory. Tests use
the production builds of the web application and API and a separate
`kuda_krym_e2e` PostgreSQL database.

Do not point `E2E_DATABASE_URL` at a development or production database because
the E2E setup applies migrations and replaces seed data.
