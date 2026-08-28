import {
  beachListResponseSchema,
  type BeachCatalogQuery,
  type BeachListResponse,
} from "@kuda-krym/contracts";

import { createBeachCatalogUrl } from "../model/create-beach-catalog-url";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getBeaches(
  query: BeachCatalogQuery = {},
): Promise<BeachListResponse> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(createBeachCatalogUrl(apiUrl, query), {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Beaches API returned status ${response.status}`);
  }

  return beachListResponseSchema.parse(await response.json());
}

