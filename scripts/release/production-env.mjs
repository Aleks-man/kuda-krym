const placeholderFragments = ["example.com", "replace-with", "changeme"];

export function validateProductionEnv(environment) {
  const errors = [];
  const siteUrl = parseRequiredUrl("SITE_URL", environment.SITE_URL, errors);
  const webOrigin = parseRequiredUrl(
    "WEB_ORIGIN",
    environment.WEB_ORIGIN,
    errors,
  );
  const databaseUrl = parseRequiredUrl(
    "DATABASE_URL",
    environment.DATABASE_URL,
    errors,
  );

  validatePublicOrigin("SITE_URL", siteUrl, errors);
  validatePublicOrigin("WEB_ORIGIN", webOrigin, errors);

  if (siteUrl && webOrigin && siteUrl.origin !== webOrigin.origin) {
    errors.push("WEB_ORIGIN must match the public SITE_URL origin");
  }

  if (
    databaseUrl &&
    databaseUrl.protocol !== "postgresql:" &&
    databaseUrl.protocol !== "postgres:"
  ) {
    errors.push("DATABASE_URL must use the postgresql or postgres protocol");
  }

  for (const [name, value] of Object.entries(environment)) {
    if (
      value &&
      placeholderFragments.some((fragment) => value.toLowerCase().includes(fragment))
    ) {
      errors.push(`${name} still contains a placeholder value`);
    }
  }

  return errors;
}

function parseRequiredUrl(name, value, errors) {
  if (!value) {
    errors.push(`${name} is required`);
    return undefined;
  }

  try {
    return new URL(value);
  } catch {
    errors.push(`${name} must be a valid URL`);
    return undefined;
  }
}

function validatePublicOrigin(name, url, errors) {
  if (!url) {
    return;
  }

  if (url.protocol !== "https:") {
    errors.push(`${name} must use https in production`);
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    errors.push(`${name} must contain only the public origin`);
  }

  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    errors.push(`${name} must not point to localhost in production`);
  }
}
