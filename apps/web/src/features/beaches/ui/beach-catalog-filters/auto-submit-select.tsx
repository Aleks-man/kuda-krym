"use client";

import type { ComponentProps } from "react";

type AutoSubmitSelectProps = Omit<ComponentProps<"select">, "onChange">;

export function AutoSubmitSelect(props: AutoSubmitSelectProps) {
  return (
    <select
      {...props}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
    />
  );
}
