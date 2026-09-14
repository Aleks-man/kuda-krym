import type { MapPosition } from "./interactive-map.types";

type YandexEventHandler = () => void;

export type YandexGeoObject = object;

export type YandexMap = Readonly<{
  behaviors: {
    disable: (behavior: string) => void;
  };
  destroy: () => void;
  geoObjects: {
    add: (object: YandexGeoObject) => void;
  };
  setBounds: (
    bounds: readonly [MapPosition, MapPosition],
    options: Readonly<{ checkZoomRange: boolean; zoomMargin: number }>,
  ) => void;
}>;

export type YandexMapsApi = Readonly<{
  ready: (callback: YandexEventHandler) => void;
  Map: new (
    container: HTMLElement,
    state: Readonly<{
      center: MapPosition;
      controls: readonly string[];
      zoom: number;
    }>,
    options: Readonly<{ suppressMapOpenBlock: boolean }>,
  ) => YandexMap;
  Placemark: new (
    position: MapPosition,
    properties: Readonly<Record<string, string>>,
    options: Readonly<Record<string, string>>,
  ) => YandexGeoObject;
  Polyline: new (
    positions: readonly MapPosition[],
    properties: Readonly<Record<string, never>>,
    options: Readonly<Record<string, number | string>>,
  ) => YandexGeoObject;
  Clusterer: new (
    options: Readonly<Record<string, boolean | number | string>>,
  ) => YandexGeoObject & {
    add: (objects: readonly YandexGeoObject[]) => void;
  };
}>;

declare global {
  interface Window {
    ymaps?: YandexMapsApi;
  }
}

const scriptId = "yandex-maps-api";
let apiPromise: Promise<YandexMapsApi> | undefined;

export function loadYandexMapsApi(apiKey: string): Promise<YandexMapsApi> {
  if (window.ymaps) {
    return whenReady(window.ymaps);
  }

  if (apiPromise) {
    return apiPromise;
  }

  apiPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(scriptId);
    const script = existingScript instanceof HTMLScriptElement
      ? existingScript
      : createApiScript(apiKey);

    script.addEventListener("load", () => {
      if (!window.ymaps) {
        reject(new Error("Yandex Maps API did not initialize"));
        return;
      }

      whenReady(window.ymaps).then(resolve, reject);
    }, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Yandex Maps API failed to load")),
      { once: true },
    );

    if (!existingScript) {
      document.head.append(script);
    }
  });

  return apiPromise;
}

function createApiScript(apiKey: string): HTMLScriptElement {
  const source = new URL("https://api-maps.yandex.ru/2.1/");
  source.searchParams.set("apikey", apiKey);
  source.searchParams.set("lang", "ru_RU");

  const script = document.createElement("script");
  script.id = scriptId;
  script.async = true;
  script.src = source.toString();
  return script;
}

function whenReady(api: YandexMapsApi): Promise<YandexMapsApi> {
  return new Promise((resolve) => api.ready(() => resolve(api)));
}
