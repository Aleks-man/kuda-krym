import { connection } from "next/server";

import { getCoastalLocations } from "../../api/get-coastal-locations";
import { CoastalForecastFinder } from "./coastal-forecast-finder";
import styles from "@/features/recommendations/ui/recommendation-preferences/recommendation-preferences.module.css";

export async function CoastalForecastFinderSection() {
  await connection();
  const { data: locations } = await getCoastalLocations();

  return (
    <section
      className={styles.section}
      aria-labelledby="forecast-finder-title"
      style={{
        alignItems: "end",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        maxWidth: "1180px",
        padding: "16px 20px",
        zIndex: 3,
      }}
    >
      <div className={styles.intro} style={{ flex: "1 1 190px", position: "static" }}>
        <p>Прогноз по побережью</p>
        <h2 id="forecast-finder-title" style={{ fontSize: "20px" }}>
          Выберите населённый пункт
        </h2>
      </div>
      <div style={{ flex: "1 1 360px" }}>
        <CoastalForecastFinder locations={locations} />
      </div>
    </section>
  );
}