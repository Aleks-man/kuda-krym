import Link from "next/link";
import { connection } from "next/server";

import { getCoastalLocations } from "../../api/get-coastal-locations";
import { CoastalForecastFinder } from "./coastal-forecast-finder";
import styles from "@/features/recommendations/ui/recommendation-preferences/recommendation-preferences.module.css";
import fieldStyles from "@/features/departure-locations/ui/departure-location-field/departure-location-field.module.css";
import homeStyles from "@/app/page.module.css";

export async function CoastalForecastFinderSection() {
  await connection();
  const locations = await loadCoastalLocations();

  if (!locations) return null;

  return (
    <section
      className={styles.section}
      aria-labelledby="forecast-finder-title"
      style={{ zIndex: 3, alignItems: "start", padding: "clamp(20px, 3vw, 32px)", gap: "20px", gridTemplateColumns: "minmax(0, 1fr)" }}
    >
      <div className={styles.intro} style={{ position: "static" }}>
        <p className={fieldStyles.label} style={{ marginBottom: "10px", fontSize: "12px", letterSpacing: ".04em", lineHeight: "18px" }}>Погода и море · на неделю</p>
        <h2 id="forecast-finder-title" style={{ fontSize: "30px", lineHeight: 1.1 }}>Прогноз погоды</h2>
        <span style={{ marginTop: "12px", fontSize: "14px", lineHeight: 1.5 }}>
          Узнайте температуру воды, силу ветра и высоту волн там, куда собираетесь.
        </span>
      </div>
      <div className={styles.form} style={{ gap: "12px" }}>
        <CoastalForecastFinder locations={locations} />
        <div className={styles.footer}>
          <Link className={homeStyles.action} href="/coast" style={{ padding: "12px 18px", fontSize: "13px" }}>
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
