export const metrikaId = 112933626;
export type MetrikaGoal = "recommendation_submit" | "recommendation_results" | "recommendation_empty" | "recommendation_error";

type MetrikaFunction = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
declare global {
  interface Window {
    ym?: MetrikaFunction;
    dataLayer?: unknown[];
    kudaMetrika?: { initialized: boolean; lastUrl?: string };
  }
}

function isEnabled() {
  return typeof window !== "undefined" && ["kudakrym.ru", "www.kudakrym.ru"].includes(window.location.hostname);
}

function initialize() {
  if (!isEnabled()) return false;
  if (window.kudaMetrika?.initialized) return true;
  if (!window.ym) {
    const queue: MetrikaFunction = (...args) => { queue.a!.push(args); };
    queue.a = [];
    queue.l = Date.now();
    window.ym = queue;
  }
  window.dataLayer ??= [];
  window.ym(metrikaId, "init", {
    defer: true, ssr: true, webvisor: true, clickmap: true, ecommerce: "dataLayer",
    accurateTrackBounce: true, trackLinks: true,
    referrer: document.referrer, url: window.location.href,
  });
  window.kudaMetrika = { initialized: true };
  if (!document.getElementById("yandex-metrika-tag")) {
    const script = document.createElement("script");
    script.id = "yandex-metrika-tag";
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js?id=" + metrikaId;
    document.head.appendChild(script);
  }
  return true;
}

export function trackPageView() {
  try {
    if (!initialize()) return;
    const url = window.location.href;
    const state = window.kudaMetrika!;
    if (state.lastUrl === url) return;
    window.ym!(metrikaId, "hit", url, { title: document.title, referer: state.lastUrl ?? document.referrer });
    state.lastUrl = url;
  } catch {
    // Analytics must never interrupt navigation or application actions.
  }
}

export function trackGoal(goal: MetrikaGoal) {
  try {
    if (initialize()) window.ym!(metrikaId, "reachGoal", goal);
  } catch {
    // Blocking analytics must not break the recommendation form.
  }
}
