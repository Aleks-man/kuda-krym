import {
  apiErrorSchema,
  departureLocationSearchQuerySchema,
  departureLocationSearchResponseSchema,
} from "@kuda-krym/contracts";

export async function searchDepartureLocations(
  query: string,
  signal?: AbortSignal,
) {
  const parsedQuery = departureLocationSearchQuerySchema.parse({ query });
  const url = new URL("/api/departure-locations", window.location.origin);
  url.searchParams.set("query", parsedQuery.query);

  const response = await fetch(url, { signal });
  const body: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorSchema.safeParse(body);
    throw new Error(
      error.success
        ? error.data.error.message
        : "Не удалось найти населённый пункт",
    );
  }

  return departureLocationSearchResponseSchema.parse(body).data;
}
