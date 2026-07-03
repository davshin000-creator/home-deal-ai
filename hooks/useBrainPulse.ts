"use client";

import { useEffect, useMemo, useState } from "react";

const modes = [
  "Listening",
  "Scanning",
  "Valuing",
  "Forecasting",
  "Risk-checking",
  "Negotiating",
  "Reasoning",
];

export function useBrainPulse() {
  const [index, setIndex] = useState(0);
  const [pulse, setPulse] = useState(72);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % modes.length);
      setPulse(68 + Math.floor(Math.random() * 24));
    }, 1600);

    return () => window.clearInterval(interval);
  }, []);

  const mode = modes[index];

  const status = useMemo(() => {
    if (pulse >= 86) return "High Activity";
    if (pulse >= 76) return "Active";
    return "Stable";
  }, [pulse]);

  return {
    mode,
    pulse,
    status,
  };
}
