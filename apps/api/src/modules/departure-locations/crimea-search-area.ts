export const crimeaSearchBoundingBox = {
  minLongitude: 32.3,
  minLatitude: 44.35,
  maxLongitude: 36.75,
  maxLatitude: 46.25,
} as const;

export function isInsideCrimeaSearchArea(
  latitude: number,
  longitude: number,
): boolean {
  return (
    latitude >= crimeaSearchBoundingBox.minLatitude &&
    latitude <= crimeaSearchBoundingBox.maxLatitude &&
    longitude >= crimeaSearchBoundingBox.minLongitude &&
    longitude <= crimeaSearchBoundingBox.maxLongitude
  );
}
