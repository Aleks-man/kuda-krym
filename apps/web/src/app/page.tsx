import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { RecommendationPreferences } from "@/features/recommendations/ui/recommendation-preferences/recommendation-preferences";

import styles from "./page.module.css";

const previewScore = 84;

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.glow} aria-hidden="true" />
      <section className={styles.hero}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>
            <span className={styles.liveDot} aria-hidden="true" />
            Умный выбор побережья
          </p>
          <h1 className={styles.title}>
            Куда поехать
            <span>к морю?</span>
          </h1>
          <p className={styles.description}>
            Выберем лучшее побережье по погоде и состоянию моря.
          </p>
          <div className={styles.actions}>
            <Link className={styles.action} href="/beaches">
              Смотреть пляжи
              <span aria-hidden="true">→</span>
            </Link>
            <span className={styles.caption}>Без регистрации · бесплатно</span>
          </div>
          <ul className={styles.trust} aria-label="Преимущества сервиса">
            <li>Погода и море</li>
            <li>Время в пути</li>
            <li>Понятный рейтинг</li>
          </ul>
        </div>

        <aside className={styles.preview} aria-label="Пример рекомендации">
          <div className={styles.previewTop}>
            <div>
              <p className={styles.previewLabel}>Пример результата</p>
              <h2>Заозёрное</h2>
            </div>
            <div className={styles.scoreSummary}>
              <span>Общая оценка условий</span>
              <div
                aria-label={`Общая оценка условий: ${previewScore} из 100`}
                className={styles.score}
                style={{ "--score": previewScore } as CSSProperties}
              >
                <strong>{previewScore}</strong>
                <small>из 100</small>
              </div>
            </div>
          </div>
          <div className={styles.seaScene}>
            <Image
              src="/images/places/zaozernoe-sunset-2010.webp"
              alt="Закат над Чёрным морем у Заозёрного"
              fill
              priority
              sizes="(max-width: 660px) calc(100vw - 76px), (max-width: 900px) 568px, 460px"
              className={styles.seaImage}
            />
          </div>
          <div className={styles.conditions}>
            <div>
              <span>Волны</span>
              <strong>0,3 м</strong>
            </div>
            <div>
              <span>Вода</span>
              <strong>+24°</strong>
            </div>
            <div>
              <span>Дорога</span>
              <strong>52 мин</strong>
            </div>
          </div>
          <p className={styles.explanation}>
            Спокойное море, слабый ветер и комфортная температура воды.
          </p>
        </aside>
      </section>
      <RecommendationPreferences />
    </main>
  );
}

