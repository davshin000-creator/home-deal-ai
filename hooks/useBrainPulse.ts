"use client";

import { useEffect, useMemo, useState } from "react";

const states = [
  {
    label: "Thinking",
    detail: "Synthesizing valuation, risk, and offer signals.",
    intensity: 88,
  },
  {
    label: "Analyzing",
    detail: "Checking deal spread, rental strength, and timing.",
    intensity: 92,
  },
  {
    label: "Forecasting",
    detail: "Estimating next best action and decision confidence.",
    intensity: 84,
  },
  {
    label: "Negotiating",
    detail: "Preparing price discipline and offer guardrails.",
    intensity: 96,
  },
];

export function useBrainPulse() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % states.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  const state = states[index];

  const pulse = useMemo(() => {
    return {
      ...state,
      progress: state.intensity,
      cycle: index + 1,
      total: states.length,
    };
  }, [state, index]);

  return pulse;
}
