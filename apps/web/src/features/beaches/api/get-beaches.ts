import {
  beachListResponseSchema,
  type BeachListResponse,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getBeaches(): Promise<BeachListResponse> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(new URL("/api/beaches", apiUrl), {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Beaches API returned status ${response.status}`);
  }

  return beachListResponseSchema.parse(await response.json());
}

