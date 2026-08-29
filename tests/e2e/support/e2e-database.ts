const defaultDatabaseUrl =
  "postgresql://postgres:postgres@127.0.0.1:5432/kuda_krym_e2e?schema=public";

export function getE2eDatabaseUrl(
  environment: NodeJS.ProcessEnv = process.env,
): string {
  const databaseUrl = environment.E2E_DATABASE_URL ?? defaultDatabaseUrl;
  const parsed = new URL(databaseUrl);
  const databaseName = decodeURIComponent(parsed.pathname.slice(1));

  if (!isPostgreSqlProtocol(parsed.protocol)) {
    throw new Error("E2E_DATABASE_URL must use the PostgreSQL protocol");
  }

  if (!databaseName.endsWith("_e2e")) {
    throw new Error(
      "Refusing to prepare E2E data: database name must end with _e2e",
    );
  }

  return databaseUrl;
}

function isPostgreSqlProtocol(protocol: string): boolean {
  return protocol === "postgresql:" || protocol === "postgres:";
}
