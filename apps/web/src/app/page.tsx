import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <p className={styles.eyebrow}>Сервис рекомендаций</p>
        <h1 className={styles.title}>Куда.Крым</h1>
        <p className={styles.description}>
          Подберём пляж по погоде, состоянию моря и времени в пути.
        </p>
      </section>
    </main>
  );
}

