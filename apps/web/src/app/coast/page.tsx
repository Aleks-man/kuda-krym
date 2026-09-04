import { getCoastalLocations } from "@/features/coastal-locations/api/get-coastal-locations";
import { CoastalLocationGroups } from "@/features/coastal-locations/ui/coastal-location-groups/coastal-location-groups";
import { CoastalLocationMap } from "@/features/coastal-locations/ui/coastal-location-map/coastal-location-map";
import { createPageMetadata } from "@/shared/seo/page-metadata";

import styles from "./page.module.css";

export const metadata = createPageMetadata({
  title: "Прогноз у моря в Крыму",
  description: "Погода и состояние моря в прибрежных районах Крыма.",
  pathname: "/coast",
});

export const dynamic = "force-dynamic";

export default async function CoastPage() {
  const { data: locations, meta } = await getCoastalLocations();

  return (
    <main className={styles.main}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Прогноз по районам</p>
        <h1>Погода у моря в Крыму</h1>
        <p className={styles.description}>
          Выберите прибрежный район, чтобы посмотреть погоду, ветер, волны и
          температуру моря. Конкретные места отдыха собраны отдельно в каталоге
          пляжей.
        </p>
        <p className={styles.count}>Зон прогноза: {meta.total}</p>
      </header>

      <CoastalLocationMap locations={locations} />
      <CoastalLocationGroups locations={locations} />
    </main>
  );
}
