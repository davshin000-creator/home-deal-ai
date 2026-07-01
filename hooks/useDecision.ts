"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DecisionApiResult,
  DecisionRequest,
  defaultDecisionInput,
  getAnalyzeDecision,
  getDecision,
} from "@/lib/ai/client";

export function useDecision() {
  const [input, setInput] = useState<DecisionRequest>(defaultDecisionInput);
  const [decision, setDecision] = useState<DecisionApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (nextInput?: DecisionRequest) => {
      const activeInput = nextInput || input;

      try {
        setRunning(true);
        setLoading(!decision);
        setError(null);

        const hasManualNumbers =
          !!activeInput.askingPrice &&
          !!activeInput.fairValue &&
          !!activeInput.estimatedRent;

        const result = hasManualNumbers
          ? await getDecision(activeInput)
          : await getAnalyzeDecision({
              address: activeInput.address,
              city: activeInput.city,
              state: activeInput.state,
            });

        setInput(activeInput);
        setDecision(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load decision.");
      } finally {
        setLoading(false);
        setRunning(false);
      }
    },
    [decision, input]
  );

  useEffect(() => {
    run(defaultDecisionInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { input, decision, loading, running, error, run, refresh: () => run(input) };
}
