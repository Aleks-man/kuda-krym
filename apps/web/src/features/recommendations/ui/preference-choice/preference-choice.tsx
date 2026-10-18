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
        {icon ? (
          <b aria-hidden="true">
            {icon === "warm-water" ? (
              <WarmWaterIcon />
            ) : icon === "comfortable-weather" ? (
              <ComfortableWeatherIcon />
            ) : icon === "calm-sea" ? (
              <CalmSeaIcon />
            ) : icon}
          </b>
        ) : null}
        <span>
          <strong>{label}</strong>
          {detail ? <small>{detail}</small> : null}
        </span>
      </span>
    </label>
  );
}

function WarmWaterIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M10.5 10.5V4a1.5 1.5 0 0 1 3 0v6.5a3 3 0 1 1-3 0Z" />
      <path d="M12 6.5v6" />
      <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none" />
      <path d="M4 18.5q2-1.5 4 0t4 0 4 0 4 0M4 21.5q2-1.5 4 0t4 0 4 0 4 0" />
    </svg>
  );
}

function ComfortableWeatherIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M8 13a4 4 0 1 1 7-4" />
      <path d="M11 2v1M4.6 4.6l.7.7M2 11h1M4.6 17.4l.7-.7M17.4 4.6l-.7.7" />
      <path d="M9 20a3 3 0 1 1 .5-6 4.5 4.5 0 0 1 8.8-1A3.5 3.5 0 1 1 18.5 20Z" />
    </svg>
  );
}

function CalmSeaIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M3 9.5c3-2 6-2 9 0s6 2 9 0M3 15.5c3-2 6-2 9 0s6 2 9 0" />
    </svg>
  );
}
