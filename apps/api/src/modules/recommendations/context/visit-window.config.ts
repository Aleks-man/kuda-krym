import type { RecommendationRequest } from "@kuda-krym/contracts";

type TimeCode = RecommendationRequest["time"];

export const visitWindows: Record<
  TimeCode,
  Readonly<{ startsAt: string; endsAt: string }>
> = {
  morning: { startsAt: "09:00", endsAt: "13:00" },
  day: { startsAt: "12:00", endsAt: "17:00" },
  evening: { startsAt: "15:00", endsAt: "19:00" },
};
