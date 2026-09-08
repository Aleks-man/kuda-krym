"use client";

import { usePathname } from "next/navigation";

import styles from "./site-background.module.css";

type BackgroundVariant = "home" | "coast" | "beaches";

export function SiteBackground() {
  const pathname = usePathname();
  const activeVariant = getBackgroundVariant(pathname);

  return (
    <div aria-hidden="true" className={styles.backdrop}>
      <span
        className={`${styles.layer} ${styles[activeVariant]}`}
        key={activeVariant}
      />
    </div>
  );
}

function getBackgroundVariant(pathname: string): BackgroundVariant {
  if (pathname === "/coast" || pathname.startsWith("/coast/")) {
    return "coast";
  }

  if (
    pathname === "/beaches" ||
    pathname.startsWith("/beaches/") ||
    pathname === "/compare"
  ) {
    return "beaches";
  }

  return "home";
}
