import {
  coastalLocationListResponseSchema,
  type CoastalLocationListResponse,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getCoastalLocations(): Promise<CoastalLocationListResponse> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(new URL("/api/coastal-locations", apiUrl), {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Coastal locations API returned status ${response.status}`);
  }

  return coastalLocationListResponseSchema.parse(await response.json());
}
