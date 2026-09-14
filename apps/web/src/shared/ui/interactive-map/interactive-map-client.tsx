"use client";

import { useEffect, useRef, useState } from "react";

import type {
  InteractiveMapProps,
  MapPoint,
  MapPosition,
} from "./interactive-map.types";
import styles from "./interactive-map.module.css";
import {
  loadYandexMapsApi,
  type YandexGeoObject,
  type YandexMap,
  type YandexMapsApi,
} from "./yandex-maps-api";

const yandexMapsApiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY?.trim();
const emptyMapPoints: readonly MapPoint[] = [];
const emptyMapPositions: readonly MapPosition[] = [];

export function InteractiveMapClient({
  center,
  clusterPoints = false,
  points = emptyMapPoints,
  route = emptyMapPositions,
  zoom = 9,
  ariaLabel = "Интерактивная карта",
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    yandexMapsApiKey ? "loading" : "error",
  );
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !yandexMapsApiKey) {
      return;
    }

    let disposed = false;
    let map: YandexMap | undefined;

    loadYandexMapsApi(yandexMapsApiKey)
      .then((api) => {
        if (disposed) {
          return;
        }

        map = createMap(api, container, { center, clusterPoints, points, route, zoom });
        setStatus("ready");
      })
      .catch(() => {
        if (!disposed) {
          setStatus("error");
        }
      });

    return () => {
      disposed = true;
      map?.destroy();
      container.replaceChildren();
    };
  }, [center, clusterPoints, points, route, zoom]);

  return (
    <div className={styles.frame} aria-label={ariaLabel} role="region">
      <div className={styles.map} ref={containerRef} />
      {status !== "ready" ? (
        <div className={styles.status} role={status === "error" ? "status" : undefined}>
          {status === "loading" ? "Загружаем карту…" : "Карта временно недоступна"}
        </div>
      ) : null}
    </div>
  );
}

type CreateMapOptions = Pick<
  InteractiveMapProps,
  "center" | "clusterPoints" | "points" | "route" | "zoom"
>;

function createMap(
  api: YandexMapsApi,
  container: HTMLElement,
  {
    center,
    clusterPoints = false,
    points = [],
    route = [],
    zoom = 9,
  }: CreateMapOptions,
) {
  const map = new api.Map(
    container,
    { center, controls: ["zoomControl"], zoom },
    { suppressMapOpenBlock: false },
  );
  map.behaviors.disable("scrollZoom");

  const markers = points.map((point) => createMarker(api, point));

  if (clusterPoints && markers.length > 1) {
    const clusterer = new api.Clusterer({
      clusterDisableClickZoom: false,
      clusterOpenBalloonOnClick: false,
      gridSize: 64,
      preset: "islands#orangeClusterIcons",
    });
    clusterer.add(markers);
    map.geoObjects.add(clusterer);
  } else {
    markers.forEach((marker) => map.geoObjects.add(marker));
  }

  if (route.length >= 2) {
    map.geoObjects.add(new api.Polyline(route, {}, {
      strokeColor: "#087f8c",
      strokeOpacity: 0.9,
      strokeWidth: 5,
    }));
  }

  const visiblePositions = route.length > 0
    ? route
    : points.map(({ position }) => position);

  if (visiblePositions.length >= 2) {
    map.setBounds(getBounds(visiblePositions), {
      checkZoomRange: true,
      zoomMargin: 28,
    });
  }

  return map;
}

function createMarker(api: YandexMapsApi, point: MapPoint): YandexGeoObject {
  return new api.Placemark(
    point.position,
    {
      balloonContentHeader: escapeHtml(point.label),
      ...(point.description
        ? { balloonContentBody: escapeHtml(point.description) }
        : {}),
      ...(point.href
        ? {
            balloonContentFooter: `<a class="${styles.popupAction}" href="${escapeHtml(point.href)}">${escapeHtml(point.actionLabel ?? "Открыть")} →</a>`,
          }
        : {}),
      hintContent: escapeHtml(point.label),
    },
    {
      iconColor: point.variant === "city" ? "#e58b45" : "#087f8c",
      preset: "islands#circleDotIcon",
    },
  );
}

function getBounds(
  positions: readonly MapPosition[],
): readonly [MapPosition, MapPosition] {
  const latitudes = positions.map(([latitude]) => latitude);
  const longitudes = positions.map(([, longitude]) => longitude);

  return [
    [Math.min(...latitudes), Math.min(...longitudes)],
    [Math.max(...latitudes), Math.max(...longitudes)],
  ];
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]!);
}
