import { OsmType, Region } from "../../src/generated/prisma/client.js";

export type SeedBeach = Readonly<{
  slug: string;
  name: string;
  officialName: string;
  region: Region;
  locality: string;
  latitude: string;
  longitude: string;
  osmType: OsmType;
  osmId: bigint;
}>;

export const seedBeaches: readonly SeedBeach[] = [
  {
    slug: "uchkuevka",
    name: "Пляж Учкуевка",
    officialName: "Учкуевка",
    region: Region.SEVASTOPOL,
    locality: "Севастополь",
    latitude: "44.644844",
    longitude: "33.536119",
    osmType: OsmType.WAY,
    osmId: 130042680n,
  },
  {
    slug: "lyubimovka",
    name: "Пляж Любимовка",
    officialName: "Любимовка",
    region: Region.SEVASTOPOL,
    locality: "Севастополь",
    latitude: "44.659856",
    longitude: "33.543911",
    osmType: OsmType.WAY,
    osmId: 129971155n,
  },
  {
    slug: "omega",
    name: "Пляж Омега",
    officialName: "Пляж Омега",
    region: Region.SEVASTOPOL,
    locality: "Севастополь",
    latitude: "44.597638",
    longitude: "33.444116",
    osmType: OsmType.WAY,
    osmId: 230870022n,
  },
  {
    slug: "yashmovyy",
    name: "Яшмовый пляж",
    officialName: "Яшмовый пляж",
    region: Region.SEVASTOPOL,
    locality: "Севастополь",
    latitude: "44.503340",
    longitude: "33.507753",
    osmType: OsmType.WAY,
    osmId: 410891199n,
  },
  {
    slug: "alushta-city-beach",
    name: "Городской пляж Алушты",
    officialName: "Городской пляж",
    region: Region.SOUTH_COAST,
    locality: "Алушта",
    latitude: "44.673934",
    longitude: "34.416429",
    osmType: OsmType.WAY,
    osmId: 231221208n,
  },
  {
    slug: "sudak-central",
    name: "Центральный городской пляж Судака",
    officialName: "Центральный городской пляж",
    region: Region.EAST_CRIMEA,
    locality: "Судак",
    latitude: "44.839935",
    longitude: "34.973753",
    osmType: OsmType.WAY,
    osmId: 169812393n,
  },
  {
    slug: "feodosia-golden-beach",
    name: "Золотой пляж",
    officialName: "Золотой пляж",
    region: Region.EAST_CRIMEA,
    locality: "Береговое",
    latitude: "45.084927",
    longitude: "35.425032",
    osmType: OsmType.RELATION,
    osmId: 9338571n,
  },
  {
    slug: "olenevka-miami",
    name: "Пляж Майами",
    officialName: "Пляж Майами",
    region: Region.WEST_CRIMEA,
    locality: "Оленевка",
    latitude: "45.370471",
    longitude: "32.515378",
    osmType: OsmType.RELATION,
    osmId: 7110570n,
  },
  {
    slug: "popovka",
    name: "Пляж Поповка",
    officialName: "Пляж Поповка",
    region: Region.WEST_CRIMEA,
    locality: "Поповка",
    latitude: "45.296314",
    longitude: "33.030565",
    osmType: OsmType.RELATION,
    osmId: 7114030n,
  },
  {
    slug: "nikolaevka-skif",
    name: "Пляж Скиф",
    officialName: "Пляж Скиф",
    region: Region.WEST_CRIMEA,
    locality: "Николаевка",
    latitude: "44.959945",
    longitude: "33.604369",
    osmType: OsmType.WAY,
    osmId: 230611686n,
  },
] as const;

