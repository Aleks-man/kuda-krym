import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  WEB_ORIGIN: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.url().optional(),
  OSRM_BASE_URL: z.url().default("https://router.project-osrm.org/"),
  RATE_LIMIT_EXPENSIVE_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .min(1)
    .max(1_000)
    .default(10),
  RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .min(1)
    .max(10_000)
    .default(120),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce
    .number()
    .int()
    .min(1)
    .max(3_600)
    .default(60),
  REDIS_URL: z.url().default("redis://127.0.0.1:6379"),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(0),
}).refine(
  (env) =>
    env.RATE_LIMIT_EXPENSIVE_MAX_REQUESTS <= env.RATE_LIMIT_MAX_REQUESTS,
  {
    message:
      "RATE_LIMIT_EXPENSIVE_MAX_REQUESTS must not exceed RATE_LIMIT_MAX_REQUESTS",
    path: ["RATE_LIMIT_EXPENSIVE_MAX_REQUESTS"],
  },
);

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

