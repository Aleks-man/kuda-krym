"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Props = Readonly<{ className?: string }>;

function ContextualLink({ className }: Props) {
  const from = useSearchParams().get("from");
  const fromHome = from === "home";
  const fromRecommendations = from === "recommendations";
  return (
    <Link className={className} href={fromRecommendations ? "/#preferences" : fromHome ? "/" : "/coast"}>
      {fromRecommendations ? "← К подбору" : fromHome ? "← На главную" : "← К населённым пунктам"}
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
