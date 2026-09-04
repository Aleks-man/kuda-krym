import { useEffect, useRef, useState } from "react";

const mapPreloadMargin = "320px";

export function useDeferredMap() {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;

    if (!placeholder || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: mapPreloadMargin },
    );

    observer.observe(placeholder);

    return () => observer.disconnect();
  }, []);

  return { placeholderRef, shouldRender };
}
