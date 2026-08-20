import { beachDetailSchema, type BeachDetail } from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getBeach(slug: string): Promise<BeachDetail | null> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(
    new URL(`/api/beaches/${encodeURIComponent(slug)}`, apiUrl),
    { next: { revalidate: 300 } },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Beach API returned status ${response.status}`);
  }

  return beachDetailSchema.parse(await response.json());
}
