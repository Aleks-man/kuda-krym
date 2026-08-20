import type { RecommendationRequest } from "@kuda-krym/contracts";

import type { RecommendationOrigin } from "./recommendation-context.js";

type OriginCode = RecommendationRequest["origin"];

export const recommendationOrigins: Record<OriginCode, RecommendationOrigin> = {
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
};
