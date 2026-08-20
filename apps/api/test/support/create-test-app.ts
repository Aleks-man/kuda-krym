import type { BeachDetail, BeachListItem } from "@kuda-krym/contracts";

import { createApp } from "../../src/app.js";
import { parseEnv } from "../../src/config/env.js";
import type { BeachRepository } from "../../src/modules/beaches/beach.repository.js";
import { BeachService } from "../../src/modules/beaches/beach.service.js";

type TestAppData = Readonly<{
  beaches?: BeachListItem[];
  details?: BeachDetail[];
}>;

export function createTestApp({ beaches = [], details = [] }: TestAppData = {}) {
  const beachRepository: BeachRepository = {
    findPublished: async () => beaches,
    findPublishedBySlug: async (slug) =>
      details.find((beach) => beach.slug === slug) ?? null,
  };

  return createApp({
    env: parseEnv({ NODE_ENV: "test" }),
    dependencies: {
      beachService: new BeachService(beachRepository),
    },
  });
}

