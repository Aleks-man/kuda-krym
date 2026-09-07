import type { DepartureLocation } from "@kuda-krym/contracts";
import { useEffect, useState } from "react";

import { searchDepartureLocations } from "../api/search-departure-locations";

type SearchState = Readonly<{
  query: string;
  status: "idle" | "loading" | "success" | "error";
  locations: readonly DepartureLocation[];
}>;

const searchDelayMilliseconds = 400;

export function useDepartureLocationSearch(query: string) {
  const normalizedQuery = query.trim();
  const [state, setState] = useState<SearchState>({
    query: "",
    status: "idle",
    locations: [],
  });

  useEffect(() => {
    if (normalizedQuery.length < 2) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setState({ query: normalizedQuery, status: "loading", locations: [] });

      try {
        const locations = await searchDepartureLocations(
          normalizedQuery,
          controller.signal,
        );
        setState({ query: normalizedQuery, status: "success", locations });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ query: normalizedQuery, status: "error", locations: [] });
      }
    }, searchDelayMilliseconds);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [normalizedQuery]);

  if (normalizedQuery.length < 2 || state.query !== normalizedQuery) {
    return { status: "idle" as const, locations: [] };
  }

  return { status: state.status, locations: state.locations };
}
