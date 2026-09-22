"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "./metrika";

export function YandexMetrika() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    trackPageView();
  }, [pathname, search]);
  return null;
}
