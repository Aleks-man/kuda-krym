"use client";

import { SelectField } from "@/shared/ui/select-field/select-field";

import { travelTimeOptions } from "../../model/preference-options";

export function TravelTimeField({ value, onChange }: { value?: string; onChange?: (value: string) => void } = {}) {
  return (
    <SelectField
      initialValue="60"
      value={value}
      onChange={onChange}
      label="Максимум в дороге"
      name="maxTravelMinutes"
      options={travelTimeOptions}
    />
  );
}
