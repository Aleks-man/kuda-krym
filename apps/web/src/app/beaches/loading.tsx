import styles from "./loading.module.css";

export default function BeachesLoading() {
  return (
    <main className={styles.main} aria-busy="true" aria-live="polite">
      <div className={styles.heading} />
      <div className={styles.grid}>
        {Array.from({ length: 3 }, (_, index) => (
          <div className={styles.card} key={index} />
        ))}
      </div>
      <span className={styles.srOnly}>Загружаем пляжи…</span>
    </main>
  );
}

