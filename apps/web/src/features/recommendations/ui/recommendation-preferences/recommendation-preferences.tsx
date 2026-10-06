"use client";

import type { RecommendationResponse } from "@kuda-krym/contracts";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { SelectField } from "@/shared/ui/select-field/select-field";
import { trackGoal } from "@/shared/analytics/metrika";
import { submitRecommendations } from "../../api/submit-recommendations";
import { DepartureLocationField } from "@/features/departure-locations/ui/departure-location-field/departure-location-field";
import { createRecommendationRequest } from "../../model/recommendation-form";
import {
  getRecommendationDateOptions,
  parseRelativeRecommendationDate,
  resolveRecommendationDate,
} from "../../model/crimea-date";
import {
  getFirstAvailableRecommendationTime,
  getUnavailableRecommendationTimes,
  isTodayUnavailable,
  type RecommendationTime,
} from "../../model/recommendation-time-availability";
import {
  priorityOptions,
  timeOptions,
} from "../../model/preference-options";
import { PreferenceChoice } from "../preference-choice/preference-choice";
import { RecommendationResults } from "../recommendation-results/recommendation-results";
import { TravelTimeField } from "../travel-time-field/travel-time-field";
import {
  readRecommendationSession,
  saveRecommendationSession,
  type RecommendationDraft,
  type RecommendationSession,
} from "../../model/recommendation-session";
import { getPopularDepartureLocations } from "@/features/departure-locations/model/departure-location-option";
import styles from "./recommendation-preferences.module.css";

export function RecommendationPreferences() {
  const client = useSyncExternalStore(subscribeToClientState, getClientSnapshot, getServerSnapshot);
  return (
    <RecommendationPreferencesForm
      key={client ? "client" : "server"}
      restored={client ? readRecommendationSession() : null}
      persist={client}
    />
  );
}

function RecommendationPreferencesForm({ restored, persist }: { restored: RecommendationSession | null; persist: boolean }) {
  const [draft, setDraft] = useState<RecommendationDraft>(() => restored?.draft ?? {
    originQuery: "Симферополь", origin: getPopularDepartureLocations("Симферополь")[0] ?? null,
    date: "today", time: "day", priority: "calm_sea", maxTravelMinutes: "60",
  });
  const [result, setResult] = useState<RecommendationResponse | null>(restored?.result ?? null);
  const [resultSavedAt, setResultSavedAt] = useState<number | null>(restored?.resultSavedAt ?? null);
  const selectedDate = draft.date;
  const selectedTime = draft.time;
  const updateDraft = (patch: Partial<RecommendationDraft>) => setDraft(previous => ({ ...previous, ...patch }));
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!result) return;
    resultsRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }, [result]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canShowCurrentDates = persist;
  const currentDate = canShowCurrentDates ? new Date() : null;
  const todayIsUnavailable = currentDate
    ? isTodayUnavailable(currentDate)
    : false;
  const effectiveDate =
    selectedDate === "today" && todayIsUnavailable
      ? "tomorrow"
      : selectedDate;
  const unavailableTimes = currentDate
    ? getUnavailableRecommendationTimes(effectiveDate, currentDate)
    : new Set<RecommendationTime>();
  const effectiveTime = currentDate && unavailableTimes.has(selectedTime)
    ? getFirstAvailableRecommendationTime(effectiveDate, currentDate)
    : selectedTime;

  useEffect(() => {
    if (!persist) return;
    saveRecommendationSession({ draft: { ...draft, date: effectiveDate, time: effectiveTime },
      calendarDate: resolveRecommendationDate(effectiveDate), result, resultSavedAt });
  }, [draft, effectiveDate, effectiveTime, persist, result, resultSavedAt]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const request = createRecommendationRequest(new FormData(event.currentTarget));
      trackGoal("recommendation_submit");
      const response = await submitRecommendations(request);
      setResult(response);
      setResultSavedAt(Date.now());
      trackGoal(response.data.length > 0 ? "recommendation_results" : "recommendation_empty");
    } catch (cause) {
      trackGoal("recommendation_error");
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Не удалось подобрать пляжи");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="preferences-title"
      className={styles.section}
      id="preferences"
    >
      <div className={styles.intro}>
        <p>Подбор места</p>
        <h2 id="preferences-title">Найдём подходящее место у моря</h2>
        <span>
          Укажите, откуда и когда хотите поехать. Сравним варианты по времени
          в пути, погоде и состоянию моря.
        </span>
      </div>

      <form aria-busy={isLoading} className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <DepartureLocationField
            value={{ query: draft.originQuery, selected: draft.origin }}
            onChange={({ query, selected }) => updateDraft({ originQuery: query, origin: selected })}
            preserveSelectionOnFocus={restored !== null}
          />

          <TravelTimeField value={draft.maxTravelMinutes} onChange={(maxTravelMinutes) => updateDraft({ maxTravelMinutes })} />
        </div>

        <fieldset className={styles.fieldset}>
          <legend>Когда</legend>
          {currentDate ? (
            <SelectField
              hideLabel
              label="Дата поездки"
              name="date"
              value={effectiveDate}
              onChange={(value) => updateDraft({ date: parseRelativeRecommendationDate(value) })}
              options={getRecommendationDateOptions(currentDate).filter((option) => option.value !== "today" || !todayIsUnavailable)}
            />
          ) : <input type="hidden" name="date" value={effectiveDate} />}
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>В какое время</legend>
          <div className={styles.fourColumns}>
            {timeOptions.map((option) => (
              <PreferenceChoice
                checked={effectiveTime === option.value}
                detail={option.detail}
                disabled={unavailableTimes.has(option.value)}
                key={option.value}
                label={option.label}
                name="time"
                onChange={() => updateDraft({ time: option.value })}
                value={option.value}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Что важнее всего</legend>
          <div className={styles.threeColumns}>
            {priorityOptions.map((option) => (
              <PreferenceChoice
                checked={draft.priority === option.value}
                onChange={() => updateDraft({ priority: option.value })}
                icon={option.icon}
                key={option.value}
                label={option.label}
                name="priority"
                value={option.value}
              />
            ))}
          </div>
        </fieldset>

        <div className={styles.footer}>
          <button
            aria-describedby={error ? "recommendation-error" : "recommendation-help"}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Сравниваем условия…" : "Подобрать пляж"}
          </button>
          <p id="recommendation-help">
            Подберём подходящие варианты с учётом прогноза погоды, состояния
            моря и ваших приоритетов.
          </p>
        </div>
        {error ? (
          <div className={styles.error} id="recommendation-error" role="alert">
            {error}
          </div>
        ) : null}
      </form>
      {result ? <RecommendationResults ref={resultsRef} result={result} /> : null}
    </section>
  );
}

function subscribeToClientState() {
  return () => undefined;
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}
