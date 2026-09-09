"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import styles from "./select-field.module.css";

export type SelectFieldOption = Readonly<{
  value: string;
  label: string;
}>;

type SelectFieldProps = Readonly<{
  initialValue: string;
  label: string;
  name: string;
  options: readonly SelectFieldOption[];
  submitOnChange?: boolean;
}>;

export function SelectField({
  initialValue,
  label,
  name,
  options,
  submitOnChange = false,
}: SelectFieldProps) {
  const labelId = useId();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === initialValue)),
  );
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  function selectOption(optionValue: string) {
    setValue(optionValue);
    setIsOpen(false);
    setActiveIndex(
      Math.max(0, options.findIndex((option) => option.value === optionValue)),
    );

    if (submitOnChange && inputRef.current) {
      inputRef.current.value = optionValue;
      inputRef.current.form?.requestSubmit();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setIsOpen(true);
      setActiveIndex((index) =>
        Math.max(0, Math.min(index + direction, options.length - 1)),
      );
    } else if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      const activeOption = options[activeIndex];
      if (activeOption) selectOption(activeOption.value);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  if (!selectedOption) return null;

  return (
    <div
      className={styles.field}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <span className={styles.label} id={labelId}>
        {label}
      </span>
      <div className={styles.control}>
        <button
          aria-activedescendant={
            isOpen && options[activeIndex]
              ? `${listboxId}-${activeIndex}`
              : undefined
          }
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={labelId}
          className={styles.trigger}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={handleKeyDown}
          role="combobox"
          type="button"
        >
          <span>{selectedOption.label}</span>
          <i aria-hidden="true" />
        </button>
        <input name={name} ref={inputRef} type="hidden" value={value} />

        <div
          aria-hidden={!isOpen}
          className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
          id={listboxId}
          role="listbox"
        >
          {options.map((option, index) => (
            <button
              aria-selected={option.value === value}
              className={`${styles.option} ${index === activeIndex ? styles.active : ""}`}
              id={`${listboxId}-${index}`}
              key={option.value}
              onClick={() => selectOption(option.value)}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              tabIndex={-1}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
