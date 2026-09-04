"use client";

import type { RecommendationResponse } from "@kuda-krym/contracts";
import { useState, type FormEvent } from "react";
import { submitRecommendations } from "../../api/submit-recommendations";
import { createRecommendationRequest } from "../../model/recommendation-form";
import {
  companyOptions,
  dateOptions,
  originOptions,
  priorityOptions,
  surfaceOptions,
  timeOptions,
  travelTimeOptions,
} from "../../model/preference-options";
import { PreferenceChoice } from "../preference-choice/preference-choice";
import { RecommendationResults } from "../recommendation-results/recommendation-results";
import styles from "./recommendation-preferences.module.css";

export function RecommendationPreferences() {
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        <p>Персональный подбор</p>
        <h2 id="preferences-title">Расскажите, какой день у моря вам нужен</h2>
        <span>
          Эти параметры станут входными данными для понятной рекомендации, а
          не просто фильтрами каталога.
        </span>
      </div>

      <form aria-busy={isLoading} className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label className={styles.selectField}>
            <span>Откуда выезжаем</span>
            <select defaultValue="simferopol" name="origin">
              {originOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.selectField}>
            <span>Максимум в дороге</span>
            <select defaultValue="120" name="maxTravelMinutes">
              {travelTimeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className={styles.fieldset}>
          <legend>Когда</legend>
          <div className={styles.twoColumns}>
            {dateOptions.map((option, index) => (
              <PreferenceChoice
                defaultChecked={index === 0}
                key={option.value}
                label={option.label}
                name="date"
                value={option.value}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>В какое время</legend>
          <div className={styles.threeColumns}>
            {timeOptions.map((option, index) => (
              <PreferenceChoice
                defaultChecked={index === 1}
                detail={option.detail}
                key={option.value}
                label={option.label}
                name="time"
                value={option.value}
              />
            ))}
          </div>
        </fieldset>

        <div className={styles.row}>
          <fieldset className={styles.fieldset}>
            <legend>Кто едет</legend>
            <div className={styles.threeColumns}>
              {companyOptions.map((option, index) => (
                <PreferenceChoice
                  defaultChecked={index === 0}
                  key={option.value}
                  label={option.label}
                  name="company"
                  value={option.value}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Покрытие пляжа</legend>
            <div className={styles.threeColumns}>
              {surfaceOptions.map((option, index) => (
                <PreferenceChoice
                  defaultChecked={index === 0}
                  key={option.value}
                  label={option.label}
                  name="surface"
                  value={option.value}
                />
              ))}
            </div>
          </fieldset>
        </div>

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
