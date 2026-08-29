export type MapPosition = [latitude: number, longitude: number];

export type MapPoint = Readonly<{
  id: string;
  label: string;
  description?: string;
  position: MapPosition;
  href?: string;
  actionLabel?: string;
}>;

export type InteractiveMapProps = Readonly<{
  center: MapPosition;
  clusterPoints?: boolean;
  points?: readonly MapPoint[];
  route?: readonly MapPosition[];
  zoom?: number;
  ariaLabel?: string;
}>;
