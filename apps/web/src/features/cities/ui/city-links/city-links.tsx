import Link from "next/link";
import { cities } from "../../model/cities";
import styles from "./city-links.module.css";
export function CityLinks() {
  return <section className={styles.section} aria-labelledby="city-list-title">
    <header className={styles.heading}><h2 id="city-list-title">Погода в городах и посёлках Крыма</h2></header>
    <ul className={styles.list}>{cities.map(city => <li key={city.slug}>
      <Link href={`/cities/${city.slug}`}>Погода: {city.name}</Link><p>{city.areaLabel}</p>
    </li>)}</ul>
  </section>;
}
