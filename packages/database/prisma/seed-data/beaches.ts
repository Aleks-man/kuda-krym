import type { SeedBeach } from "./beaches/beach-seed.types.js";
import { eastCrimeaBeaches } from "./beaches/east-crimea-beaches.js";
import { sevastopolBeaches } from "./beaches/sevastopol-beaches.js";
import { southCoastBeaches } from "./beaches/south-coast-beaches.js";
import { westCrimeaBeaches } from "./beaches/west-crimea-beaches.js";

export const seedBeaches = [
  ...sevastopolBeaches,
  ...southCoastBeaches,
  ...eastCrimeaBeaches,
  ...westCrimeaBeaches,
] as const satisfies readonly SeedBeach[];
