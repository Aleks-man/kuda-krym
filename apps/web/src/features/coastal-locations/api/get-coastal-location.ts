import {
  coastalLocationSchema,
  type CoastalLocation,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getCoastalLocation(
  slug: string,
): Promise<CoastalLocation | null> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(
    new URL(`/api/coastal-locations/${encodeURIComponent(slug)}`, apiUrl),
    { next: { revalidate: 300 } },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Coastal location API returned status ${response.status}`);
  }

  return coastalLocationSchema.parse(await response.json());
}
