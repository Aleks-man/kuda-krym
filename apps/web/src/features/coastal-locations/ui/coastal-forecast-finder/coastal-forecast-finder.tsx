"use client";

import type { CoastalLocation } from "@kuda-krym/contracts";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type KeyboardEvent } from "react";

import fieldStyles from "@/features/departure-locations/ui/departure-location-field/departure-location-field.module.css";

import { getForecastPlaceOptions, type ForecastPlaceOption } from "../../model/forecast-place-options";

type CoastalForecastFinderProps = Readonly<{
  locations: readonly CoastalLocation[];
}>;

export function CoastalForecastFinder({ locations }: CoastalForecastFinderProps) {
  const router = useRouter();
  const inputId = useId();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const options = useMemo(
    () => getForecastPlaceOptions(locations, query),
    [locations, query],
  );
  const activeOption = options[activeIndex];

  function openLocation(location: ForecastPlaceOption) {
    setQuery(location.name);
    setIsOpen(false);
    router.push(location.href);
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
    } else if (event.key === "Enter" && activeOption) {
      event.preventDefault();
      openLocation(activeOption);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div
      className={fieldStyles.field}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <label
        className={fieldStyles.label}
        htmlFor={inputId}
        style={{ lineHeight: "18px" }}
      >
        Населённый пункт
      </label>
      <span className={fieldStyles.control}>
        <input
          aria-activedescendant={
            isOpen && activeOption
              ? `${listboxId}-${activeOption.slug}`
              : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          autoComplete="off"
          id={inputId}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Например, Николаевка"
          role="combobox"
          style={{ fontSize: "16px", padding: "0 16px" }}
          value={query}
        />
        <span
          aria-hidden={!isOpen}
          className={`${fieldStyles.dropdown} ${isOpen ? fieldStyles.dropdownOpen : ""}`}
          id={listboxId}
          role="listbox"
          style={{
            borderRadius: "12px",
            maxHeight: "220px",
            overscrollBehavior: "contain",
            padding: "5px",
            zIndex: 50,
          }}
        >
          {options.map((location, index) => (
            <button
              aria-selected={index === activeIndex}
              className={fieldStyles.option}
              id={`${listboxId}-${location.slug}`}
              key={location.id}
              onClick={() => openLocation(location)}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              tabIndex={-1}
              type="button"
            >
              <strong>{location.name}</strong>
              <small>
                {location.detail}
              </small>
            </button>
          ))}
          {options.length === 0 ? (
            <span className={fieldStyles.status}>Такой зоны прогноза пока нет</span>
          ) : null}
        </span>
      </span>
    </div>
  );
}