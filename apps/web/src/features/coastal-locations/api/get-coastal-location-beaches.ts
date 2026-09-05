import {
  coastalLocationBeachesResponseSchema,
  type CoastalLocationBeachesResponse,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getCoastalLocationBeaches(
  slug: string,
): Promise<CoastalLocationBeachesResponse | null> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(
    new URL(
      `/api/coastal-locations/${encodeURIComponent(slug)}/beaches`,
      apiUrl,
    ),
    { next: { revalidate: 300 } },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      `Coastal location beaches API returned status ${response.status}`,
    );
  }

  return coastalLocationBeachesResponseSchema.parse(await response.json());
}
