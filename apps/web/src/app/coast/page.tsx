import { getCoastalLocations } from "@/features/coastal-locations/api/get-coastal-locations";
import { CoastalLocationGroups } from "@/features/coastal-locations/ui/coastal-location-groups/coastal-location-groups";
import { CoastalLocationMap } from "@/features/coastal-locations/ui/coastal-location-map/coastal-location-map";
import { createPageMetadata } from "@/shared/seo/page-metadata";

import styles from "./page.module.css";

export const metadata = createPageMetadata({
  title: "Побережье Крыма",
  description: "Карта прибрежных городов и зон морского прогноза Крыма.",
  pathname: "/coast",
});

export const dynamic = "force-dynamic";

export default async function CoastPage() {
  const { data: locations, meta } = await getCoastalLocations();

  return (
    <main className={styles.main}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Погода у моря</p>
        <h1>Всё побережье Крыма</h1>
        <p className={styles.description}>
          От Черноморского до Керчи — единая карта прибрежных городов и точек,
          для которых мы собираем погоду, ветер, волны и морские условия.
        </p>
        <p className={styles.count}>Зон прогноза: {meta.total}</p>
      </header>

      <CoastalLocationMap locations={locations} />
      <CoastalLocationGroups locations={locations} />
    </main>
  );
}
