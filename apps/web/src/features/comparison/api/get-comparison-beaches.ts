import type { BeachDetail } from "@kuda-krym/contracts";
import { getBeach } from "@/features/beaches/api/get-beach";

function isBeach(beach: BeachDetail | null): beach is BeachDetail {
  return beach !== null;
}

export async function getComparisonBeaches(slugs: string[]) {
  const beaches = await Promise.all(slugs.map((slug) => getBeach(slug)));
  return beaches.filter(isBeach);
}
