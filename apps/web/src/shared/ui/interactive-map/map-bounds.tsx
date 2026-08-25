"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { MapPosition } from "./interactive-map.types";

type MapBoundsProps = Readonly<{
  center: MapPosition;
  positions: readonly MapPosition[];
  zoom: number;
}>;

export function MapBounds({ center, positions, zoom }: MapBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (positions.length < 2) {
      map.setView(center, zoom);
      return;
    }

    map.fitBounds([...positions], { padding: [28, 28], maxZoom: 13 });
  }, [center, map, positions, zoom]);

  return null;
}
