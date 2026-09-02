import { initialCoastalLocationImages } from "./coastal-location-images/initial-coastal-location-images.js";
import { southCoastCoastalImages } from "./coastal-location-images/south-coast-coastal-images.js";
import { westCrimeaCoastalImages } from "./coastal-location-images/west-crimea-coastal-images.js";

export const seedCoastalLocationImages = [
  ...westCrimeaCoastalImages,
  ...southCoastCoastalImages,
  ...initialCoastalLocationImages,
];
