"use client";

import { useCallback, useEffect, useState } from "react";
import { DecisionApiResult, getDecision } from "@/lib/ai/client";

export function useDecision() {
  const [decision, setDecision] = useState<DecisionApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDecision();
      setDecision(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load decision.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { decision, loading, error, refresh };
}
