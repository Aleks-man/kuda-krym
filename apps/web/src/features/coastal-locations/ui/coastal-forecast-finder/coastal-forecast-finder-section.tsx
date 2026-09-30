import Link from "next/link";
import { connection } from "next/server";

import { getCoastalLocations } from "../../api/get-coastal-locations";
import { CoastalForecastFinder } from "./coastal-forecast-finder";
import styles from "@/features/recommendations/ui/recommendation-preferences/recommendation-preferences.module.css";
import fieldStyles from "@/features/departure-locations/ui/departure-location-field/departure-location-field.module.css";
import homeStyles from "@/app/page.module.css";
import sectionStyles from "./coastal-forecast-finder-section.module.css";

export async function CoastalForecastFinderSection() {
  await connection();
  const locations = await loadCoastalLocations();

  if (!locations) return null;

  return (
    <section
      className={`${styles.section} ${sectionStyles.section}`}
      aria-labelledby="forecast-finder-title"
    >
      <div className={`${styles.intro} ${sectionStyles.intro}`}>
        <p className={fieldStyles.label}>Погода и море · на неделю</p>
        <h2 id="forecast-finder-title">Прогноз погоды</h2>
        <span>
          Узнайте температуру воды, силу ветра и высоту волн там, куда собираетесь.
        </span>
      </div>
      <div className={`${styles.form} ${sectionStyles.form}`}>
        <CoastalForecastFinder locations={locations} />
        <div className={styles.footer}>
          <Link className={`${homeStyles.action} ${sectionStyles.action}`} href="/coast">
            Все прибрежные населённые пункты <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

async function loadCoastalLocations() {
  try {
    const { data } = await getCoastalLocations();
    return data;
  } catch {
    return null;
  }
}
