import Link from "next/link";

import { BeachGrid } from "@/features/beaches/ui/beach-grid/beach-grid";

import { getCoastalLocationBeaches } from "../../api/get-coastal-location-beaches";
import styles from "./coastal-location-beaches.module.css";

type CoastalLocationBeachesProps = Readonly<{
  slug: string;
}>;

export async function CoastalLocationBeaches({
  slug,
}: CoastalLocationBeachesProps) {
  const result = await loadBeaches(slug);

  if (!result || result.data.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="nearby-beaches-title">
      <header className={styles.heading}>
        <div>
          <p>Конкретные места</p>
          <h2 id="nearby-beaches-title">Пляжи рядом</h2>
        </div>
        <Link href="/beaches">Весь каталог →</Link>
      </header>
      <p className={styles.description}>
        Прогноз выше описывает условия у побережья. Выберите конкретный пляж,
        чтобы посмотреть его расположение и подтверждённые сведения.
      </p>
      <BeachGrid beaches={result.data} />
    </section>
  );
}

async function loadBeaches(slug: string) {
  try {
    return await getCoastalLocationBeaches(slug);
  } catch {
    return null;
  }
}
