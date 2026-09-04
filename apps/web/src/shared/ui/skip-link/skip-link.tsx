import styles from "./skip-link.module.css";

export function SkipLink() {
  return (
    <a className={styles.link} href="#main-content">
      Перейти к основному содержимому
    </a>
  );
}
