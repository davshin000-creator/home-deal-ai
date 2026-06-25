"use client";

import { useEffect, useState } from "react";

export default function ScoreCounter({
  score,
  suffix = "/100",
}: {
  score: number;
  suffix?: string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const target = Math.max(0, Math.min(100, Number(score || 0)));
    const duration = 900;
    const steps = 30;
    const increment = target / steps;
    let frame = 0;

    const timer = setInterval(() => {
      frame += 1;
      setCurrent(Math.min(target, Math.round(increment * frame)));
      if (frame >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  return <span>{current}{suffix}</span>;
}
