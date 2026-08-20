import type { BeachListItem } from "@kuda-krym/contracts";

import { createApp } from "../../src/app.js";
import { parseEnv } from "../../src/config/env.js";
import type { BeachRepository } from "../../src/modules/beaches/beach.repository.js";
import { BeachService } from "../../src/modules/beaches/beach.service.js";

export function createTestApp(beaches: BeachListItem[] = []) {
  const beachRepository: BeachRepository = {
    findPublished: async () => beaches,
  };

  return createApp({
    env: parseEnv({ NODE_ENV: "test" }),
    dependencies: {
      beachService: new BeachService(beachRepository),
    },
  });
}

