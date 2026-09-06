"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BENCHES } from "@/lib/evals/benches";

// The combined evals page used "#bench" and "#bench/metric" deep links.
// Benchmarks now have their own pages, so forward old links there.
export default function HashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const [bench, metric] = location.hash.replace("#", "").split("/");
    if (!(BENCHES as readonly string[]).includes(bench)) return;
    router.replace(`/evals/${bench}/${metric ? `#${metric}` : ""}`);
  }, [router]);
  return null;
}
