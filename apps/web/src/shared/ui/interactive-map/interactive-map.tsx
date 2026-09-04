"use client";

import dynamic from "next/dynamic";
import type { InteractiveMapProps } from "./interactive-map.types";
import { useDeferredMap } from "./use-deferred-map";
import styles from "./interactive-map.module.css";

const InteractiveMapClient = dynamic(
  () =>
    import("./interactive-map-client").then(
      ({ InteractiveMapClient: MapClient }) => MapClient,
    ),
  {
    ssr: false,
    loading: () => <div className={styles.loading}>Загружаем карту…</div>,
  },
);

export function InteractiveMap(props: InteractiveMapProps) {
  const { placeholderRef, shouldRender } = useDeferredMap();

  if (!shouldRender) {
    return (
      <div className={styles.loading} ref={placeholderRef}>
        Карта загрузится при прокрутке
      </div>
    );
  }

  return <InteractiveMapClient {...props} />;
}

export type { InteractiveMapProps, MapPoint, MapPosition } from "./interactive-map.types";
