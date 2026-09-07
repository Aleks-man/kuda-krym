import type { DepartureLocation, RecommendationRequest } from "@kuda-krym/contracts";

import { originOptions } from "../../recommendations/model/preference-options";

export type DepartureLocationOption = Readonly<{
  id: string;
  label: string;
  context: string;
  value: RecommendationRequest["origin"];
}>;

export function getPopularDepartureLocations(
  query: string,
): DepartureLocationOption[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");

  return originOptions
    .filter(({ label }) =>
      label.toLocaleLowerCase("ru").includes(normalizedQuery),
    )
    .map(({ label, value }) => ({
      id: `popular:${value}`,
      label,
      context: "Популярное направление",
      value,
    }));
}

export function mergeDepartureLocationOptions(
  popular: readonly DepartureLocationOption[],
  searched: readonly DepartureLocation[],
): DepartureLocationOption[] {
  const knownNames = new Set(
    popular.map(({ label }) => label.toLocaleLowerCase("ru")),
  );
  const remoteOptions = searched
    .filter(({ name }) => !knownNames.has(name.toLocaleLowerCase("ru")))
    .map((location) => ({
      id: location.id,
      label: location.name,
      context: location.context,
      value: location,
    }));

  return [...popular, ...remoteOptions].slice(0, 8);
}

export function serializeDepartureLocation(
  value: RecommendationRequest["origin"],
): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}
