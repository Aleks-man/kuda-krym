import styles from "./preference-choice.module.css";

type PreferenceChoiceProps = Readonly<{
  name: string;
  value: string;
  label: string;
  detail?: string;
  icon?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
}>;

export function PreferenceChoice({
  name,
  value,
  label,
  detail,
  icon,
  defaultChecked,
  checked,
  disabled = false,
  onChange,
}: PreferenceChoiceProps) {
  return (
    <label className={`${styles.choice} ${disabled ? styles.disabled : ""}`}>
      <input
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        name={name}
        onChange={onChange}
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
