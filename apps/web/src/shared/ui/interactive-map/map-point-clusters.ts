import type { MapPoint, MapPosition } from "./interactive-map.types";

const tileSize = 256;
const maximumLatitude = 85.05112878;

export type MapPointCluster = Readonly<{
  id: string;
  position: MapPosition;
  points: readonly MapPoint[];
}>;

export function clusterMapPoints(
  points: readonly MapPoint[],
  zoom: number,
  radiusPixels = 48,
): MapPointCluster[] {
  const projected = points.map((point) => ({
    point,
    pixel: projectToPixel(point.position, zoom),
  }));
  const visited = new Set<string>();
  const clusters: MapPointCluster[] = [];

  for (const candidate of projected) {
    if (visited.has(candidate.point.id)) continue;

    const members: MapPoint[] = [];
    const pending = [candidate];
    visited.add(candidate.point.id);

    while (pending.length > 0) {
      const current = pending.pop()!;
      members.push(current.point);

      for (const neighbour of projected) {
        if (visited.has(neighbour.point.id)) continue;
        if (pixelDistance(current.pixel, neighbour.pixel) > radiusPixels) continue;

        visited.add(neighbour.point.id);
        pending.push(neighbour);
      }
    }

    clusters.push(createCluster(members));
  }

  return clusters;
}

function createCluster(points: MapPoint[]): MapPointCluster {
  const [latitude, longitude] = points.reduce<MapPosition>(
    ([latitudeSum, longitudeSum], point) => [
      latitudeSum + point.position[0],
      longitudeSum + point.position[1],
    ],
    [0, 0],
  );

  return {
    id: points.map(({ id }) => id).sort().join(":"),
    position: [latitude / points.length, longitude / points.length],
    points,
  };
}

function projectToPixel(
  [latitude, longitude]: MapPosition,
  zoom: number,
): readonly [x: number, y: number] {
  const scale = tileSize * 2 ** zoom;
  const boundedLatitude = Math.max(
    -maximumLatitude,
    Math.min(maximumLatitude, latitude),
  );
  const sine = Math.sin((boundedLatitude * Math.PI) / 180);

  return [
    ((longitude + 180) / 360) * scale,
    (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * scale,
  ];
}

function pixelDistance(
  [firstX, firstY]: readonly [number, number],
  [secondX, secondY]: readonly [number, number],
): number {
  return Math.hypot(firstX - secondX, firstY - secondY);
}
