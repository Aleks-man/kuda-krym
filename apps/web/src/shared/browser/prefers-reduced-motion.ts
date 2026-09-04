const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return globalThis.matchMedia?.(reducedMotionQuery).matches ?? false;
}
