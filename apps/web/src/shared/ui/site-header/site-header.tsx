import Link from "next/link";

import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark} aria-hidden="true">
            К
          </span>
          <span>Куда.Крым</span>
        </Link>
        <nav aria-label="Основная навигация">
          <Link className={styles.navLink} href="/beaches">
            Пляжи
          </Link>
        </nav>
      </div>
    </header>
  );
}
