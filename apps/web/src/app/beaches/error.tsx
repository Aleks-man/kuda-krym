"use client";

import styles from "./error.module.css";

type BeachesErrorProps = Readonly<{
  reset: () => void;
}>;

export default function BeachesError({ reset }: BeachesErrorProps) {
  return (
    <main className={styles.main}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>Не удалось загрузить данные</p>
        <h1>Каталог временно недоступен</h1>
        <p>Проверьте подключение и попробуйте ещё раз.</p>
        <button className={styles.button} onClick={reset} type="button">
          Повторить
        </button>
      </section>
    </main>
  );
}

