"use client";

import { SelectField } from "@/shared/ui/select-field/select-field";

import { travelTimeOptions } from "../../model/preference-options";

export function TravelTimeField() {
  return (
    <SelectField
      initialValue="120"
      label="Максимум в дороге"
      name="maxTravelMinutes"
      options={travelTimeOptions}
    />
  );
}
