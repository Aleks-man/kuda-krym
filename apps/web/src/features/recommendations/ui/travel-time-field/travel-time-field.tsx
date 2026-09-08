"use client";

import { useId, useState, type KeyboardEvent } from "react";

import { travelTimeOptions } from "../../model/preference-options";
import styles from "./travel-time-field.module.css";

type TravelTimeValue = (typeof travelTimeOptions)[number]["value"];

const initialValue: TravelTimeValue = "120";

export function TravelTimeField() {
  const labelId = useId();
  const listboxId = useId();
  const [value, setValue] = useState<TravelTimeValue>(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    travelTimeOptions.findIndex((option) => option.value === initialValue),
  );
  const selectedOption = travelTimeOptions.find(
    (option) => option.value === value,
  )!;

  function selectOption(optionValue: TravelTimeValue) {
    setValue(optionValue);
    setIsOpen(false);
    setActiveIndex(
      travelTimeOptions.findIndex((option) => option.value === optionValue),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setIsOpen(true);
      setActiveIndex((index) =>
        Math.max(0, Math.min(index + direction, travelTimeOptions.length - 1)),
      );
    } else if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      selectOption(travelTimeOptions[activeIndex]!.value);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div
      className={styles.field}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <span className={styles.label} id={labelId}>
        Максимум в дороге
      </span>
      <div className={styles.control}>
        <button
          aria-activedescendant={
            isOpen ? `${listboxId}-${travelTimeOptions[activeIndex]!.value}` : undefined
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
        <input name="maxTravelMinutes" type="hidden" value={value} />

        <div
          aria-hidden={!isOpen}
          className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
          id={listboxId}
          role="listbox"
        >
          {travelTimeOptions.map((option, index) => (
            <button
              aria-selected={option.value === value}
              className={`${styles.option} ${index === activeIndex ? styles.active : ""}`}
              id={`${listboxId}-${option.value}`}
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
