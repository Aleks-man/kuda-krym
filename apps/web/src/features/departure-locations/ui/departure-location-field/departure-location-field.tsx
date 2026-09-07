"use client";

import { useId, useMemo, useState, type KeyboardEvent } from "react";

import {
  getPopularDepartureLocations,
  mergeDepartureLocationOptions,
  serializeDepartureLocation,
  type DepartureLocationOption,
} from "../../model/departure-location-option";
import { useDepartureLocationSearch } from "../../model/use-departure-location-search";
import styles from "./departure-location-field.module.css";

const initialOption = getPopularDepartureLocations("Симферополь")[0];

export function DepartureLocationField() {
  const inputId = useId();
  const listboxId = useId();
  const [query, setQuery] = useState(initialOption?.label ?? "");
  const [selected, setSelected] = useState<DepartureLocationOption | null>(
    initialOption ?? null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const search = useDepartureLocationSearch(query);
  const options = useMemo(
    () =>
      mergeDepartureLocationOptions(
        getPopularDepartureLocations(query),
        search.locations,
      ),
    [query, search.locations],
  );
  const activeOption = options[activeIndex];

  function selectOption(option: DepartureLocationOption) {
    setSelected(option);
    setQuery(option.label);
    setIsOpen(false);
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        options.length === 0 ? 0 : Math.min(index + 1, options.length - 1),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && isOpen && activeOption) {
      event.preventDefault();
      selectOption(activeOption);
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
      <label className={styles.label} htmlFor={inputId}>
        Откуда выезжаем
      </label>
      <span className={styles.control}>
        <input
          aria-activedescendant={
            isOpen && activeOption ? `${listboxId}-${activeOption.id}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          autoComplete="off"
          id={inputId}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(null);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Введите город или посёлок"
          role="combobox"
          value={query}
        />
        <input
          name="origin"
          type="hidden"
          value={selected ? serializeDepartureLocation(selected.value) : ""}
        />
        {isOpen ? (
          <span className={styles.dropdown} id={listboxId} role="listbox">
            {options.map((option, index) => (
              <button
                aria-selected={index === activeIndex}
                className={styles.option}
                id={`${listboxId}-${option.id}`}
                key={option.id}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
                type="button"
              >
                <strong>{option.label}</strong>
                <small>{option.context}</small>
              </button>
            ))}
            {search.status === "loading" ? (
              <span className={styles.status}>Ищем населённые пункты…</span>
            ) : null}
            {search.status === "error" ? (
              <span className={styles.status}>Поиск временно недоступен</span>
            ) : null}
            {search.status === "success" && options.length === 0 ? (
              <span className={styles.status}>Ничего не найдено</span>
            ) : null}
          </span>
        ) : null}
      </span>
    </div>
  );
}
