import {
  recommendationDateSchema, recommendationOriginSchema, recommendationPrioritySchema,
  recommendationResponseSchema, recommendationTimeSchema, type RecommendationResponse,
} from "@kuda-krym/contracts";
import type { DepartureLocationOption } from "@/features/departure-locations/model/departure-location-option";
import { getRecommendationDateOptions, resolveRecommendationDate, type RelativeRecommendationDate } from "./crimea-date";
import { travelTimeOptions } from "./preference-options";
import type { RecommendationTime } from "./recommendation-time-availability";

export const recommendationSessionKey = "kuda-krym:recommendations:v1";
export const recommendationResultLifetime = 30 * 60 * 1000;
export type RecommendationDraft = {
  originQuery: string;
  origin: DepartureLocationOption | null;
  date: RelativeRecommendationDate;
  time: RecommendationTime;
  priority: "calm_sea" | "warm_water" | "comfort";
  maxTravelMinutes: string;
};
export type RecommendationSession = {
  draft: RecommendationDraft;
  calendarDate: string;
  result: RecommendationResponse | null;
  resultSavedAt: number | null;
};
let memorySession: string | null = null;

export function parseRecommendationSession(raw: string | null, now = new Date()): RecommendationSession | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (value.version !== 1 || !value.draft) return null;
    const draft = value.draft;
    if (typeof draft.originQuery !== "string" || draft.originQuery.length > 200 ||
        !travelTimeOptions.some(option => option.value === draft.maxTravelMinutes)) return null;
    const time = recommendationTimeSchema.parse(draft.time);
    const priority = recommendationPrioritySchema.parse(draft.priority);
    let origin: DepartureLocationOption | null = null;
    if (draft.origin !== null) {
      const option = draft.origin;
      if (!option || ![option.id, option.label, option.context].every(item => typeof item === "string" && item.length <= 500)) return null;
      origin = { id: option.id, label: option.label, context: option.context, value: recommendationOriginSchema.parse(option.value) };
    }
    const calendarDate = recommendationDateSchema.parse(value.calendarDate);
    const date = getRecommendationDateOptions(now).find(option => resolveRecommendationDate(option.value, now) === calendarDate)?.value ?? "today";
    const response = recommendationResponseSchema.safeParse(value.result);
    const savedAt = value.resultSavedAt;
    const result = response.success && Number.isFinite(savedAt) && savedAt <= now.getTime() &&
      now.getTime() - savedAt < recommendationResultLifetime && response.data.context.date >= resolveRecommendationDate("today", now)
      ? response.data : null;
    return { draft: { originQuery: draft.originQuery, origin, date, time, priority, maxTravelMinutes: draft.maxTravelMinutes }, calendarDate, result, resultSavedAt: result ? savedAt : null };
  } catch { return null; }
}

export function readRecommendationSession(): RecommendationSession | null {
  try { return parseRecommendationSession(window.sessionStorage.getItem(recommendationSessionKey) ?? memorySession); }
  catch { return parseRecommendationSession(memorySession); }
}

export function saveRecommendationSession(session: RecommendationSession): void {
  const raw = JSON.stringify({ version: 1, ...session });
  memorySession = raw;
  try { window.sessionStorage.setItem(recommendationSessionKey, raw); }
  catch { /* Keep navigation state in memory when browser storage is unavailable. */ }
}
