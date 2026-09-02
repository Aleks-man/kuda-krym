import { eastCrimeaCoastalImages } from "./coastal-location-images/east-crimea-coastal-images.js";
import { initialCoastalLocationImages } from "./coastal-location-images/initial-coastal-location-images.js";
import { kerchPeninsulaCoastalImages } from "./coastal-location-images/kerch-peninsula-coastal-images.js";
import { sevastopolCoastalImages } from "./coastal-location-images/sevastopol-coastal-images.js";
import { southCoastCoastalImages } from "./coastal-location-images/south-coast-coastal-images.js";
import { westCrimeaCoastalImages } from "./coastal-location-images/west-crimea-coastal-images.js";

export const seedCoastalLocationImages = [
  ...westCrimeaCoastalImages,
  ...southCoastCoastalImages,
  ...eastCrimeaCoastalImages,
  ...sevastopolCoastalImages,
  ...kerchPeninsulaCoastalImages,
  ...initialCoastalLocationImages,
];
