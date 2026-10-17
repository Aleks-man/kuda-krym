"use client";

import { useEffect, type RefObject } from "react";

export function useDismissOnOutsidePointer(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) {
        onDismiss();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [ref, isOpen, onDismiss]);
}
