"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";

import type { MapPoint } from "./interactive-map.types";
import { clusterMapPoints } from "./map-point-clusters";
import styles from "./interactive-map.module.css";

type MapPointsLayerProps = Readonly<{
  clusterPoints: boolean;
  points: readonly MapPoint[];
}>;

export function MapPointsLayer({
  clusterPoints,
  points,
}: MapPointsLayerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: (event) => setZoom(event.target.getZoom()),
  });

  const clusters = clusterPoints
    ? clusterMapPoints(points, zoom)
    : points.map((point) => ({
        id: point.id,
        position: point.position,
        points: [point],
      }));

  return clusters.map((cluster) => {
    if (cluster.points.length === 1) {
      return <PointMarker key={cluster.id} point={cluster.points[0]!} />;
    }

    return (
      <CircleMarker
        center={cluster.position}
        eventHandlers={{
          click: () => map.flyTo(cluster.position, Math.min(zoom + 2, 16)),
        }}
        key={cluster.id}
        pathOptions={{
          className: styles.clusterMarker,
          color: "#ffffff",
          fillColor: "#e66d3f",
          fillOpacity: 1,
          weight: 3,
        }}
        radius={clusterRadius(cluster.points.length)}
      >
        <Tooltip
          className={styles.clusterLabel}
          direction="center"
          permanent
        >
          {cluster.points.length}
        </Tooltip>
      </CircleMarker>
    );
  });
}

function PointMarker({ point }: Readonly<{ point: MapPoint }>) {
  return (
    <CircleMarker
      center={point.position}
      pathOptions={{
        color: "#ffffff",
        fillColor: "#087f8c",
        fillOpacity: 1,
        weight: 3,
      }}
      radius={8}
    >
      <Popup>
        <div className={styles.popup}>
          <strong>{point.label}</strong>
          {point.description ? <span>{point.description}</span> : null}
          {point.href ? (
            <Link className={styles.popupAction} href={point.href}>
              {point.actionLabel ?? "Открыть"} →
            </Link>
          ) : null}
        </div>
      </Popup>
    </CircleMarker>
  );
}

function clusterRadius(pointCount: number): number {
  return Math.min(26, 20 + Math.sqrt(pointCount) * 1.5);
}
