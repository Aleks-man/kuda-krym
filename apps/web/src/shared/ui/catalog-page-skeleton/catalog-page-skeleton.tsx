import styles from "./catalog-page-skeleton.module.css";

type CatalogPageSkeletonProps = Readonly<{
  label: string;
  variant: "beaches" | "coast";
}>;

export function CatalogPageSkeleton({ label, variant }: CatalogPageSkeletonProps) {
  return (
    <main className={styles.main} aria-busy="true" aria-live="polite">
      <div className={styles.heading} />
      <div className={styles.grid}>
        {Array.from({ length: 3 }, (_, index) => (
          <div className={`${styles.card} ${styles[variant]}`} key={index} />
        ))}
      </div>
      <span className={styles.srOnly}>{label}</span>
    </main>
  );
}
