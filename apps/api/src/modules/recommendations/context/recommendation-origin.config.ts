import type { RecommendationOriginCode } from "@kuda-krym/contracts";

import type { RecommendationOrigin } from "./recommendation-context.js";

export const recommendationOrigins: Record<
  RecommendationOriginCode,
  RecommendationOrigin
> = {
  simferopol: {
    code: "simferopol",
    name: "Симферополь",
    latitude: 44.952117,
    longitude: 34.102417,
  },
  sevastopol: {
    code: "sevastopol",
    name: "Севастополь",
    latitude: 44.61665,
    longitude: 33.525367,
  },
  yalta: {
    code: "yalta",
    name: "Ялта",
    latitude: 44.495205,
    longitude: 34.166301,
  },
  evpatoria: {
    code: "evpatoria",
    name: "Евпатория",
    latitude: 45.190445,
    longitude: 33.366867,
  },
  feodosia: {
    code: "feodosia",
    name: "Феодосия",
    latitude: 45.031933,
    longitude: 35.382431,
  },
  kerch: {
    code: "kerch",
    name: "Керчь",
    latitude: 45.356112,
    longitude: 36.46744,
  },
  alushta: {
    code: "alushta",
    name: "Алушта",
    latitude: 44.6773,
    longitude: 34.4097,
  },
  sudak: {
    code: "sudak",
    name: "Судак",
    latitude: 44.8492,
    longitude: 34.9747,
  },
  saki: {
    code: "saki",
    name: "Саки",
    latitude: 45.1342,
    longitude: 33.6,
  },
  bakhchisaray: {
    code: "bakhchisaray",
    name: "Бахчисарай",
    latitude: 44.7552,
    longitude: 33.8578,
  },
  dzhankoy: {
    code: "dzhankoy",
    name: "Джанкой",
    latitude: 45.7131,
    longitude: 34.3927,
  },
  belogorsk: {
    code: "belogorsk",
    name: "Белогорск",
    latitude: 45.0568,
    longitude: 34.6039,
  },
  krasnoperekopsk: {
    code: "krasnoperekopsk",
    name: "Красноперекопск",
    latitude: 45.9555,
    longitude: 33.7926,
  },
  armyansk: {
    code: "armyansk",
    name: "Армянск",
    latitude: 46.1092,
    longitude: 33.6921,
  },
  chernomorskoe: {
    code: "chernomorskoe",
    name: "Черноморское",
    latitude: 45.5066,
    longitude: 32.6978,
  },
  shchelkino: {
    code: "shchelkino",
    name: "Щёлкино",
    latitude: 45.4299,
    longitude: 35.8225,
  },
};
