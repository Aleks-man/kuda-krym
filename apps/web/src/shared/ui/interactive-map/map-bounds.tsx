"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { prefersReducedMotion } from "@/shared/browser/prefers-reduced-motion";

import type { MapPosition } from "./interactive-map.types";

type MapBoundsProps = Readonly<{
  center: MapPosition;
  positions: readonly MapPosition[];
  zoom: number;
}>;

export function MapBounds({ center, positions, zoom }: MapBoundsProps) {
  const map = useMap();

  useEffect(() => {
    const animate = !prefersReducedMotion();

    if (positions.length < 2) {
      map.setView(center, zoom, { animate });
      return;
    }

    map.fitBounds([...positions], {
      animate,
      padding: [28, 28],
      maxZoom: 13,
    });
  }, [center, map, positions, zoom]);

  return null;
}
