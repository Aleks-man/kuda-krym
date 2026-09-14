import type { MapPosition } from "./interactive-map.types";

export function getMapBounds(
  positions: readonly MapPosition[],
): readonly [MapPosition, MapPosition] {
  const latitudes = positions.map(([latitude]) => latitude);
  const longitudes = positions.map(([, longitude]) => longitude);

  return [
    [Math.min(...latitudes), Math.min(...longitudes)],
    [Math.max(...latitudes), Math.max(...longitudes)],
  ];
}

export function escapeMapHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]!);
}
