"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./site-header.module.css";

const navigationItems = [
  { href: "/coast", label: "Прогноз" },
  { href: "/beaches", label: "Пляжи" },
] as const;

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation} aria-label="Основная навигация">
      {navigationItems.map((item) => (
        <Link
          aria-current={isCurrentSection(pathname, item.href) ? "page" : undefined}
          className={styles.navLink}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function isCurrentSection(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
