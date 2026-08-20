import styles from "./preference-choice.module.css";

type PreferenceChoiceProps = Readonly<{
  name: string;
  value: string;
  label: string;
  detail?: string;
  icon?: string;
  defaultChecked?: boolean;
}>;

export function PreferenceChoice({
  name,
  value,
  label,
  detail,
  icon,
  defaultChecked,
}: PreferenceChoiceProps) {
  return (
    <label className={styles.choice}>
      <input
        defaultChecked={defaultChecked}
        name={name}
        type="radio"
        value={value}
      />
      <span className={styles.content}>
        {icon ? <b aria-hidden="true">{icon}</b> : null}
        <span>
          <strong>{label}</strong>
          {detail ? <small>{detail}</small> : null}
        </span>
      </span>
    </label>
  );
}
