import "dotenv/config";

import { createPrismaClient } from "@kuda-krym/database";

import { createApp } from "./app.js";
import { parseEnv, requireDatabaseUrl } from "./config/env.js";
import { PrismaBeachRepository } from "./modules/beaches/prisma-beach.repository.js";
import { BeachService } from "./modules/beaches/beach.service.js";

const env = parseEnv(process.env);
const prisma = createPrismaClient(requireDatabaseUrl(env));
const beachRepository = new PrismaBeachRepository(prisma);
const beachService = new BeachService(beachRepository);
const app = createApp({ env, dependencies: { beachService } });

app.listen(env.PORT, () => {
  console.log(`API is running at http://localhost:${env.PORT}`);
});

