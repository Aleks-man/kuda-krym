"use client";

import Link from "next/link";
import {
  AttributionControl,
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import type { InteractiveMapProps } from "./interactive-map.types";
import { MapBounds } from "./map-bounds";
import styles from "./interactive-map.module.css";

const openStreetMapTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export function InteractiveMapClient({
  center,
  points = [],
  route = [],
  zoom = 9,
  ariaLabel = "Интерактивная карта",
}: InteractiveMapProps) {
  const positions = route.length > 0
    ? route
    : points.map(({ position }) => position);

  return (
    <div className={styles.frame} aria-label={ariaLabel} role="region">
      <MapContainer
        attributionControl={false}
        center={center}
        className={styles.map}
        scrollWheelZoom={false}
        zoom={zoom}
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={openStreetMapTiles}
        />
        {route.length >= 2 ? (
          <Polyline
            pathOptions={{ color: "#087f8c", opacity: 0.9, weight: 5 }}
            positions={[...route]}
          />
        ) : null}
        {points.map((point) => (
          <CircleMarker
            center={point.position}
            key={point.id}
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
                {point.href ? (
                  <Link href={point.href}>
                    {point.actionLabel ?? "Открыть"} →
                  </Link>
                ) : null}
              </div>
            </Popup>
          </CircleMarker>
        ))}
        <MapBounds center={center} positions={positions} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
