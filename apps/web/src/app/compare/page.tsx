import Link from "next/link";
import { getComparisonBeaches } from "@/features/comparison/api/get-comparison-beaches";
import { normalizeComparisonSlugs } from "@/features/comparison/model/normalize-comparison-slugs";
import { BeachComparison } from "@/features/comparison/ui/beach-comparison/beach-comparison";
import { createPageMetadata } from "@/shared/seo/page-metadata";
import styles from "./page.module.css";

export const metadata = createPageMetadata({
  title: "Сравнение пляжей",
  description: "Сравнение характеристик пляжей Крыма.",
  pathname: "/compare",
});

type ComparePageProps = {
  searchParams: Promise<{ beaches?: string | string[] }>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const slugs = normalizeComparisonSlugs((await searchParams).beaches);
  const beaches = await getComparisonBeaches(slugs);

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p>Выбор без догадок</p>
        <h1>Сравнение пляжей</h1>
        <span>Характеристики расположены рядом — различия видно сразу.</span>
      </header>
      {beaches.length >= 2 ? (
        <BeachComparison beaches={beaches} />
      ) : (
        <section className={styles.empty}>
          <h2>Нужно хотя бы два пляжа</h2>
          <p>Сначала получите рекомендации — мы перенесём лучшие варианты сюда автоматически.</p>
          <Link href="/#preferences">Подобрать пляжи</Link>
        </section>
      )}
    </main>
  );
}
