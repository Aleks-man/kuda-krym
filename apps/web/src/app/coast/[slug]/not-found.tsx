import Link from "next/link";

import styles from "./not-found.module.css";

export default function CoastalLocationNotFound() {
  return (
    <main className={styles.main}>
      <p>404</p>
      <h1>Такой прибрежной локации пока нет</h1>
      <span>Проверьте адрес или выберите другой город на карте побережья.</span>
      <Link href="/coast">Вернуться к побережью</Link>
    </main>
  );
}
