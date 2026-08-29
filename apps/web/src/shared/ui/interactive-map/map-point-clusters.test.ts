import { describe, expect, it } from "vitest";

import type { MapPoint } from "./interactive-map.types";
import { clusterMapPoints } from "./map-point-clusters";

describe("clusterMapPoints", () => {
  const points: MapPoint[] = [
    point("yalta-1", 44.483, 34.159),
    point("yalta-2", 44.488, 34.163),
    point("kerch", 45.352, 36.523),
  ];

  it("groups nearby points at a regional zoom", () => {
    const clusters = clusterMapPoints(points, 8);

    expect(clusters).toHaveLength(2);
    expect(clusters.map(({ points }) => points.length)).toEqual([2, 1]);
  });

  it("separates the same points at a detailed zoom", () => {
    const clusters = clusterMapPoints(points, 15);

    expect(clusters).toHaveLength(3);
  });

  it("places a cluster at the average member position", () => {
    const [cluster] = clusterMapPoints(points.slice(0, 2), 8);

    expect(cluster?.position[0]).toBeCloseTo((44.483 + 44.488) / 2);
    expect(cluster?.position[1]).toBeCloseTo((34.159 + 34.163) / 2);
    expect(cluster?.id).toBe("yalta-1:yalta-2");
  });
});

function point(id: string, latitude: number, longitude: number): MapPoint {
  return {
    id,
    label: id,
    position: [latitude, longitude],
  };
}
