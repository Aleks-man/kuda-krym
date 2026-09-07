import type { DepartureLocation } from "@kuda-krym/contracts";

export interface DepartureLocationProvider {
  search(query: string): Promise<readonly DepartureLocation[]>;
}
