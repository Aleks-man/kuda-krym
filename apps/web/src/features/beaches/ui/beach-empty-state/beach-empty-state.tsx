import Link from "next/link";

import styles from "./beach-empty-state.module.css";

type BeachEmptyStateProps = Readonly<{
  filtered?: boolean;
}>;

export function BeachEmptyState({ filtered = false }: BeachEmptyStateProps) {
  return (
    <section className={styles.state}>
      <div className={styles.icon} aria-hidden="true">
        ≋
      </div>
      {filtered ? (
        <>
          <h2>Подходящих пляжей не найдено</h2>
          <p>
            Попробуйте изменить название, регион или населённый пункт. В
            результатах остаются только места с проверенным расположением.
          </p>
          <Link className={styles.reset} href="/beaches">
            Сбросить фильтры
          </Link>
        </>
      ) : (
        <>
          <h2>Карточки готовятся к публикации</h2>
          <p>
            Мы проверяем названия и расположение пляжей. Скоро здесь появится
            каталог с подтверждёнными данными.
          </p>
        </>
      )}
    </section>
  );
}

