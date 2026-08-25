import {
  Region,
  WaterBody,
} from "../../src/generated/prisma/client.js";

export type SeedCoastalLocation = Readonly<{
  slug: string;
  name: string;
  region: Region;
  waterBody: WaterBody;
  weatherLatitude: string;
  weatherLongitude: string;
  marineLatitude: string;
  marineLongitude: string;
}>;

export const seedCoastalLocations: readonly SeedCoastalLocation[] = [
  location("chernomorskoe", "Черноморское", Region.WEST_CRIMEA, WaterBody.BLACK_SEA, 45.5066, 32.6978, 45.50, 32.64),
  location("olenevka", "Оленевка", Region.WEST_CRIMEA, WaterBody.BLACK_SEA, 45.373, 32.514, 45.34, 32.47),
  location("mezhvodnoe", "Межводное", Region.WEST_CRIMEA, WaterBody.BLACK_SEA, 45.586, 32.845, 45.61, 32.80),
  location("steregushchee", "Стерегущее", Region.WEST_CRIMEA, WaterBody.BLACK_SEA, 45.747, 33.229, 45.79, 33.20),
  location("evpatoria", "Евпатория", Region.WEST_CRIMEA, WaterBody.BLACK_SEA, 45.19, 33.367, 45.16, 33.31),
  location("zaozernoe", "Заозёрное", Region.WEST_CRIMEA, WaterBody.BLACK_SEA, 45.158, 33.278, 45.13, 33.22),
  location("novofedorovka", "Новофёдоровка", Region.WEST_CRIMEA, WaterBody.BLACK_SEA, 45.091, 33.574, 45.05, 33.54),
  location("nikolaevka", "Николаевка", Region.WEST_CRIMEA, WaterBody.BLACK_SEA, 44.966, 33.614, 44.93, 33.58),
  location("kacha", "Кача", Region.SEVASTOPOL, WaterBody.BLACK_SEA, 44.776, 33.543, 44.78, 33.49),
  location("sevastopol-north", "Севастополь — север", Region.SEVASTOPOL, WaterBody.BLACK_SEA, 44.635, 33.535, 44.62, 33.48),
  location("sevastopol-west", "Севастополь — западные бухты", Region.SEVASTOPOL, WaterBody.BLACK_SEA, 44.596, 33.443, 44.58, 33.38),
  location("fiolent", "Фиолент", Region.SEVASTOPOL, WaterBody.BLACK_SEA, 44.503, 33.508, 44.46, 33.48),
  location("balaklava", "Балаклава", Region.SEVASTOPOL, WaterBody.BLACK_SEA, 44.497, 33.6, 44.45, 33.61),
  location("foros", "Форос", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.392, 33.787, 44.35, 33.78),
  location("simeiz", "Симеиз", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.406, 33.989, 44.37, 33.99),
  location("alupka", "Алупка", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.419, 34.045, 44.38, 34.04),
  location("yalta", "Ялта", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.495, 34.166, 44.46, 34.17),
  location("gurzuf", "Гурзуф", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.544, 34.275, 44.51, 34.29),
  location("partenit", "Партенит", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.578, 34.344, 44.54, 34.36),
  location("alushta", "Алушта", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.676, 34.41, 44.64, 34.43),
  location("malorechenskoe", "Малореченское", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.758, 34.557, 44.72, 34.58),
  location("rybachye", "Рыбачье", Region.SOUTH_COAST, WaterBody.BLACK_SEA, 44.773, 34.596, 44.73, 34.62),
  location("novy-svet", "Новый Свет", Region.EAST_CRIMEA, WaterBody.BLACK_SEA, 44.829, 34.913, 44.79, 34.90),
  location("sudak", "Судак", Region.EAST_CRIMEA, WaterBody.BLACK_SEA, 44.842, 34.971, 44.80, 34.98),
  location("koktebel", "Коктебель", Region.EAST_CRIMEA, WaterBody.BLACK_SEA, 44.961, 35.245, 44.92, 35.24),
  location("ordzhonikidze", "Орджоникидзе", Region.EAST_CRIMEA, WaterBody.BLACK_SEA, 44.964, 35.356, 44.93, 35.36),
  location("feodosia", "Феодосия", Region.EAST_CRIMEA, WaterBody.BLACK_SEA, 45.035, 35.382, 45.00, 35.38),
  location("beregovoe", "Береговое", Region.EAST_CRIMEA, WaterBody.BLACK_SEA, 45.095, 35.435, 45.06, 35.44),
  location("primorsky", "Приморский", Region.EAST_CRIMEA, WaterBody.BLACK_SEA, 45.119, 35.477, 45.08, 35.48),
  location("yakovenkovo", "Яковенково", Region.KERCH_PENINSULA, WaterBody.BLACK_SEA, 45.05, 36.31, 45.01, 36.32),
  location("geroevskoe", "Героевское", Region.KERCH_PENINSULA, WaterBody.BLACK_SEA, 45.224, 36.407, 45.18, 36.42),
  location("kerch-strait", "Керчь — пролив", Region.KERCH_PENINSULA, WaterBody.KERCH_STRAIT, 45.35, 36.47, 45.34, 36.52),
  location("kurortnoe", "Курортное", Region.KERCH_PENINSULA, WaterBody.AZOV_SEA, 45.47, 36.34, 45.50, 36.34),
  location("zolotoe", "Золотое", Region.KERCH_PENINSULA, WaterBody.AZOV_SEA, 45.43, 36.08, 45.47, 36.08),
  location("shchelkino", "Щёлкино", Region.KERCH_PENINSULA, WaterBody.AZOV_SEA, 45.428, 35.825, 45.47, 35.82),
] as const;

function location(
  slug: string,
  name: string,
  region: Region,
  waterBody: WaterBody,
  weatherLatitude: number,
  weatherLongitude: number,
  marineLatitude: number,
  marineLongitude: number,
): SeedCoastalLocation {
  return {
    slug,
    name,
    region,
    waterBody,
    weatherLatitude: weatherLatitude.toFixed(6),
    weatherLongitude: weatherLongitude.toFixed(6),
    marineLatitude: marineLatitude.toFixed(6),
    marineLongitude: marineLongitude.toFixed(6),
  };
}
