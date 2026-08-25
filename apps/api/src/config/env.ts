import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  WEB_ORIGIN: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.url().optional(),
  OSRM_BASE_URL: z.url().default("https://router.project-osrm.org/"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function parseEnv(environment: NodeJS.ProcessEnv): AppEnv {
  return envSchema.parse(environment);
}

export function requireDatabaseUrl(env: AppEnv): string {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to start the API");
  }

  return env.DATABASE_URL;
}

