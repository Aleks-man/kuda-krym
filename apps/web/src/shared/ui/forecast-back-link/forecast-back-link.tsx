"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Props = Readonly<{ className?: string }>;

function ContextualLink({ className }: Props) {
  const fromHome = useSearchParams().get("from") === "home";
  return (
    <Link className={className} href={fromHome ? "/" : "/coast"}>
      {fromHome ? "← На главную" : "← К населённым пунктам"}
    </Link>
  );
}

export function ForecastBackLink({ className }: Props) {
  return (
    <Suspense fallback={<Link className={className} href="/coast">← К населённым пунктам</Link>}>
      <ContextualLink className={className} />
    </Suspense>
  );
}
