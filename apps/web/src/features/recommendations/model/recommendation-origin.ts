import {
  recommendationOriginSchema,
  type RecommendationRequest,
} from "@kuda-krym/contracts";

export function parseRecommendationOrigin(
  value: FormDataEntryValue | null,
): RecommendationRequest["origin"] {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Выберите, откуда вы планируете выезжать");
  }

  const candidate = value.startsWith("{") ? parseJson(value) : value;
  const result = recommendationOriginSchema.safeParse(candidate);

  if (!result.success) {
    throw new Error("Выберите, откуда вы планируете выезжать");
  }

  return result.data;
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
