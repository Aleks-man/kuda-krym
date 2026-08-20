import Link from "next/link";

import styles from "./not-found.module.css";

export default function BeachNotFound() {
  return (
    <main className={styles.main}>
      <p>404</p>
      <h1>Такого пляжа пока нет</h1>
      <span>Возможно, страница ещё проверяется или адрес изменился.</span>
      <Link href="/beaches">Вернуться в каталог</Link>
    </main>
  );
}
