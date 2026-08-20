import styles from "./beach-empty-state.module.css";

export function BeachEmptyState() {
  return (
    <section className={styles.state}>
      <div className={styles.icon} aria-hidden="true">
        ≋
      </div>
      <h2>Карточки готовятся к публикации</h2>
      <p>
        Мы проверяем координаты и характеристики пляжей. Скоро здесь появится
        каталог с подтверждёнными данными.
      </p>
    </section>
  );
}

