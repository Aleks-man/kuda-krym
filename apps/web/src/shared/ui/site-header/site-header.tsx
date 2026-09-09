import Link from "next/link";
import Image from "next/image";

import { SiteNavigation } from "./site-navigation";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          aria-label="На главную"
          className={styles.brand}
          href="/"
        >
          <Image
            alt=""
            aria-hidden="true"
            className={styles.brandMark}
            height={34}
            priority
            src="/brand/kuda-krym-mark.svg"
            width={34}
          />
          <span className={styles.brandName}>Куда.Крым</span>
        </Link>
        <SiteNavigation />
      </div>
    </header>
  );
}
