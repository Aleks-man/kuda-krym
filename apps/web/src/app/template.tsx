import styles from "./template.module.css";

type RouteTemplateProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RouteTemplate({ children }: RouteTemplateProps) {
  return <div className={styles.content}>{children}</div>;
}
