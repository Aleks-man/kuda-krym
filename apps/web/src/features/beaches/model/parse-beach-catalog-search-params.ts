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
  const region = beachCatalogQuerySchema.safeParse({
    region: getSingleValue(searchParams.region),
  });

  return {
    ...(region.success && region.data.region
      ? { region: region.data.region }
      : {}),
  };
}

function getSingleValue(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}
