"use client";

import type { RecommendationResponse } from "@kuda-krym/contracts";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { submitRecommendations } from "../../api/submit-recommendations";
import { DepartureLocationField } from "@/features/departure-locations/ui/departure-location-field/departure-location-field";
import { createRecommendationRequest } from "../../model/recommendation-form";
import {
  formatRecommendationDate,
  type RelativeRecommendationDate,
} from "../../model/crimea-date";
import {
  getFirstAvailableRecommendationTime,
  getUnavailableRecommendationTimes,
  isTodayUnavailable,
  type RecommendationTime,
} from "../../model/recommendation-time-availability";
import {
  dateOptions,
  priorityOptions,
  timeOptions,
} from "../../model/preference-options";
import { PreferenceChoice } from "../preference-choice/preference-choice";
import { RecommendationResults } from "../recommendation-results/recommendation-results";
import { TravelTimeField } from "../travel-time-field/travel-time-field";
import styles from "./recommendation-preferences.module.css";

export function RecommendationPreferences() {
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] =
    useState<RelativeRecommendationDate>("today");
  const [selectedTime, setSelectedTime] = useState<RecommendationTime>("day");
  const canShowCurrentDates = useSyncExternalStore(
    subscribeToClientState,
    getClientSnapshot,
    getServerSnapshot,
  );
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const request = createRecommendationRequest(new FormData(event.currentTarget));
      setResult(await submitRecommendations(request));
    } catch (cause) {
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
        <p>Подбор поездки</p>
        <h2 id="preferences-title">Найдём подходящее место у моря</h2>
        <span>
          Укажите, откуда и когда хотите поехать. Сравним дорогу, погоду и
          состояние моря.
        </span>
      </div>

      <form aria-busy={isLoading} className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <DepartureLocationField />

          <TravelTimeField />
        </div>

        <fieldset className={styles.fieldset}>
          <legend>Когда</legend>
          <div className={styles.threeColumns}>
            {dateOptions.map((option) => (
              <PreferenceChoice
                checked={effectiveDate === option.value}
                detail={
                  currentDate
                    ? formatRecommendationDate(option.value, currentDate)
                    : undefined
                }
                key={option.value}
                label={option.label}
                name="date"
                disabled={option.value === "today" && todayIsUnavailable}
                onChange={() => setSelectedDate(option.value)}
                value={option.value}
              />
            ))}
          </div>
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
                onChange={() => setSelectedTime(option.value)}
                value={option.value}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Что важнее всего</legend>
          <div className={styles.threeColumns}>
            {priorityOptions.map((option, index) => (
              <PreferenceChoice
                defaultChecked={index === 0}
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
            Учтём прогноз моря и погоды, ваши приоритеты и покажем до трёх
            лучших вариантов.
          </p>
        </div>
        {error ? (
          <div className={styles.error} id="recommendation-error" role="alert">
            {error}
          </div>
        ) : null}
      </form>
      {result ? <RecommendationResults result={result} /> : null}
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
