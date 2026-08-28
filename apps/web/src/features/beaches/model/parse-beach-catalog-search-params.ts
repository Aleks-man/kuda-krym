import {
  beachCatalogQuerySchema,
  type BeachCatalogQuery,
} from "@kuda-krym/contracts";

export type BeachCatalogSearchParams = Readonly<
  Record<string, string | string[] | undefined>
>;

export function parseBeachCatalogSearchParams(
  searchParams: BeachCatalogSearchParams,
): BeachCatalogQuery {
  const q = beachCatalogQuerySchema.safeParse({
    q: getSingleValue(searchParams.q),
  });
  const region = beachCatalogQuerySchema.safeParse({
    region: getSingleValue(searchParams.region),
  });
  const locality = beachCatalogQuerySchema.safeParse({
    locality: getSingleValue(searchParams.locality),
  });

  return {
    ...(q.success && q.data.q ? { q: q.data.q } : {}),
    ...(region.success && region.data.region
      ? { region: region.data.region }
      : {}),
    ...(locality.success && locality.data.locality
      ? { locality: locality.data.locality }
      : {}),
  };
}

function getSingleValue(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}
