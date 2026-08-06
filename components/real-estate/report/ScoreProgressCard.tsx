"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type ScoreProgressTone =
  | "emerald"
  | "cyan"
  | "amber"
  | "violet"
  | "red";

type ScoreProgressCardProps = {
  title: string;
  value?: number | null;
  tone?: ScoreProgressTone;
  description?: string;
  icon?: ReactNode;
  suffix?: string;
  className?: string;
};

const toneClasses: Record<
  ScoreProgressTone,
  {
    value: string;
    icon: string;
    bar: string;
    glow: string;
  }
> = {
  emerald: {
    value: "text-emerald-200",
    icon:
      "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    bar:
      "bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.48)]",
    glow: "bg-emerald-300/[0.08]",
  },
  cyan: {
    value: "text-cyan-200",
    icon:
      "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    bar:
      "bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.48)]",
    glow: "bg-cyan-300/[0.08]",
  },
  amber: {
    value: "text-amber-100",
    icon:
      "border-amber-300/20 bg-amber-300/10 text-amber-100",
    bar:
      "bg-amber-300 shadow-[0_0_24px_rgba(252,211,77,0.42)]",
    glow: "bg-amber-300/[0.08]",
  },
  violet: {
    value: "text-violet-200",
    icon:
      "border-violet-300/20 bg-violet-300/10 text-violet-200",
    bar:
      "bg-violet-300 shadow-[0_0_24px_rgba(196,181,253,0.46)]",
    glow: "bg-violet-300/[0.08]",
  },
  red: {
    value: "text-red-200",
    icon:
      "border-red-300/20 bg-red-300/10 text-red-200",
    bar:
      "bg-red-300 shadow-[0_0_24px_rgba(252,165,165,0.42)]",
    glow: "bg-red-300/[0.08]",
  },
};

function clampScore(value?: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}

function scoreLabel(value: number) {
  if (value >= 90) return "Excellent";
  if (value >= 80) return "Strong";
  if (value >= 70) return "Positive";
  if (value >= 60) return "Moderate";
  if (value >= 40) return "Cautious";

  return "Needs Review";
}

export default function ScoreProgressCard({
  title,
  value,
  tone = "emerald",
  description,
  icon,
  suffix = "/100",
  className = "",
}: ScoreProgressCardProps) {
  const normalizedValue = useMemo(
    () => clampScore(value),
    [value],
  );

  const [displayValue, setDisplayValue] =
    useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDisplayValue(normalizedValue);
    }, 80);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [normalizedValue]);

  const classes = toneClasses[tone];

  return (
    <article
      className={[
        "group relative min-w-0 overflow-hidden",
        "rounded-[24px] border border-white/10",
        "bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]",
        "p-5 shadow-[0_24px_70px_rgba(0,0,0,0.24)]",
        "transition duration-300",
        "hover:-translate-y-1 hover:border-white/20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute",
          "-right-16 -top-20",
          "h-44 w-44 rounded-full blur-3xl",
          classes.glow,
        ].join(" ")}
      />

      <div className="relative flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="break-words text-[10px] font-bold uppercase tracking-[0.17em] text-white/32 [overflow-wrap:anywhere]">
            {title}
          </p>

          <div className="mt-3 flex min-w-0 items-end gap-2">
            <p
              className={[
                "text-[clamp(2.35rem,5vw,3.5rem)]",
                "font-black leading-none",
                "tracking-[-0.07em]",
                classes.value,
              ].join(" ")}
            >
              {displayValue}
            </p>

            <span className="pb-1 text-xs font-semibold text-white/25">
              {suffix}
            </span>
          </div>
        </div>

        {icon ? (
          <span
            className={[
              "flex h-11 w-11 shrink-0",
              "items-center justify-center",
              "rounded-[14px] border",
              classes.icon,
            ].join(" ")}
          >
            {icon}
          </span>
        ) : null}
      </div>

      <div className="relative mt-6">
        <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className={[
              "h-full rounded-full",
              "transition-[width] duration-1000 ease-out",
              classes.bar,
            ].join(" ")}
            style={{
              width: `${displayValue}%`,
            }}
          />
        </div>

        <div className="mt-3 flex min-w-0 items-start justify-between gap-4">
          <p className="min-w-0 break-words text-xs leading-5 text-white/34 [overflow-wrap:anywhere]">
            {description ??
              scoreLabel(normalizedValue)}
          </p>

          <span
            className={[
              "shrink-0 text-xs font-bold",
              classes.value,
            ].join(" ")}
          >
            {scoreLabel(normalizedValue)}
          </span>
        </div>
      </div>
    </article>
  );
}
