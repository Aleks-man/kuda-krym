import type { RecommendationRequest } from "@kuda-krym/contracts";

type TimeCode = RecommendationRequest["time"];

export const visitWindows: Record<
  TimeCode,
  Readonly<{ startsAt: string; endsAt: string }>
> = {
  morning: { startsAt: "08:00", endsAt: "13:00" },
  day: { startsAt: "12:00", endsAt: "17:00" },
  evening: { startsAt: "15:00", endsAt: "20:00" },
  all_day: { startsAt: "08:00", endsAt: "20:00" },
};
