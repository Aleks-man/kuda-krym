import Link from "next/link";

import { RecommendationPreferences } from "@/features/recommendations/ui/recommendation-preferences/recommendation-preferences";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.glow} aria-hidden="true" />
      <section className={styles.hero}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>
            <span className={styles.liveDot} aria-hidden="true" />
            Умный выбор пляжа
          </p>
          <h1 className={styles.title}>
            Куда ехать
            <span>к морю сегодня?</span>
          </h1>
          <p className={styles.description}>
            Сравним ветер, волны, температуру воды и дорогу — и объясним,
            почему этот пляж подходит именно вам.
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
              <h2>Николаевка</h2>
            </div>
            <div className={styles.score}>
              <strong>84</strong>
              <span>из 100</span>
            </div>
          </div>
          <div className={styles.seaScene} aria-hidden="true">
            <span className={styles.sun} />
            <span className={styles.waveOne} />
            <span className={styles.waveTwo} />
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

