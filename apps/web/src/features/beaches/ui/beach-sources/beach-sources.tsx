import type { BeachDetail } from "@kuda-krym/contracts";

import styles from "./beach-sources.module.css";

export function BeachSources({ beach }: Readonly<{ beach: BeachDetail }>) {
  if (beach.sources.length === 0) return null;

  return (
    <section className={styles.section}>
      <div>
        <p className={styles.eyebrow}>Прозрачные данные</p>
        <h2>Источники</h2>
        <p className={styles.lead}>Показываем, откуда получены сведения о месте.</p>
      </div>
      <ul className={styles.list}>
        {beach.sources.map((source) => (
          <li key={`${source.field}-${source.url}`}>
            <a href={source.url} rel="noreferrer" target="_blank">
              <span>{source.title}</span>
              <small>{source.field.replaceAll("_", " ")} ↗</small>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
