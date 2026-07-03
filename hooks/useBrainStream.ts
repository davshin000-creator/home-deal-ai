"use client";

import { useEffect, useMemo, useState } from "react";

export type BrainStreamEvent = {
  id: string;
  time: string;
  title: string;
  engine: string;
  detail: string;
  status: "complete" | "active" | "queued";
};

const baseEvents: Omit<BrainStreamEvent, "id" | "time" | "status">[] = [
  {
    title: "Property data intake started",
    engine: "Input Engine",
    detail: "Address, pricing assumptions, rent estimate, and property metadata are being normalized.",
  },
  {
    title: "Valuation spread calculated",
    engine: "Decision Engine",
    detail: "Asking price is compared with estimated fair value to detect margin of safety.",
  },
  {
    title: "Rental yield model checked",
    engine: "Income Engine",
    detail: "Estimated monthly rent is translated into annual yield and income quality.",
  },
  {
    title: "Risk guardrails evaluated",
    engine: "Risk Engine",
    detail: "Inspection, rental, HOA, and carrying-cost risks are reviewed.",
  },
  {
    title: "Offer strategy generated",
    engine: "Offer Engine",
    detail: "Aggressive, balanced, and safe offer ranges are prepared.",
  },
  {
    title: "Executive recommendation prepared",
    engine: "Nestrova Brain",
    detail: "Brain converts scores and risks into a final investment action.",
  },
];

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function useBrainStream() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % baseEvents.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  const events = useMemo(() => {
    return baseEvents.map((event, index) => ({
      ...event,
      id: `${event.engine}-${index}`,
      time: nowTime(),
      status:
        index < activeIndex
          ? ("complete" as const)
          : index === activeIndex
          ? ("active" as const)
          : ("queued" as const),
    }));
  }, [activeIndex]);

  return {
    events,
    activeIndex,
    activeEvent: events[activeIndex],
  };
}
