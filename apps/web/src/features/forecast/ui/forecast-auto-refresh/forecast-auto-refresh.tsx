"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const refreshAfterMs = 5 * 60 * 1000;

export function ForecastAutoRefresh({ generatedAt }: Readonly<{ generatedAt: string }>) {
  const router = useRouter();
  const lastAttempt = useRef(0);

  useEffect(() => {
    // Use the response timestamp so restored/prefetched pages refresh on arrival.
    let lastRefresh = Date.parse(generatedAt);
    if (!Number.isFinite(lastRefresh)) lastRefresh = Date.now();
    lastRefresh = Math.max(lastRefresh, lastAttempt.current);
    function refreshIfNeeded() {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRefresh < refreshAfterMs) return;
      // Throttle failed refreshes and simultaneous focus/visibility events.
      lastRefresh = now;
      lastAttempt.current = now;
      router.refresh();
    }

    refreshIfNeeded();
    const timer = window.setInterval(refreshIfNeeded, 60_000);
    document.addEventListener("visibilitychange", refreshIfNeeded);
    window.addEventListener("focus", refreshIfNeeded);
    window.addEventListener("pageshow", refreshIfNeeded);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshIfNeeded);
      window.removeEventListener("focus", refreshIfNeeded);
      window.removeEventListener("pageshow", refreshIfNeeded);
    };
  }, [generatedAt, router]);

  return null;
}
