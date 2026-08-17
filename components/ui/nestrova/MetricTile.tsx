import type { ReactNode } from "react";

type MetricTone =
  | "neutral"
  | "cyan"
  | "violet"
  | "emerald"
  | "amber"
  | "red";

type MetricTileProps = {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
  tone?: MetricTone;
  className?: string;
  compact?: boolean;
};

const valueClasses: Record<
  MetricTone,
  string
> = {
  neutral: "text-white",
  cyan: "text-cyan-200",
  violet: "text-violet-200",
  emerald: "text-emerald-200",
  amber: "text-amber-100",
  red: "text-red-200",
};

const iconClasses: Record<
  MetricTone,
  string
> = {
  neutral:
    "border-white/10 bg-white/[0.05] text-white/45",
  cyan:
    "border-cyan-300/15 bg-cyan-300/10 text-cyan-200",
  violet:
    "border-violet-300/15 bg-violet-300/10 text-violet-200",
  emerald:
    "border-emerald-300/15 bg-emerald-300/10 text-emerald-200",
  amber:
    "border-amber-300/15 bg-amber-300/10 text-amber-100",
  red:
    "border-red-300/15 bg-red-300/10 text-red-200",
};

export default function MetricTile({
  label,
  value,
  detail,
  icon,
  tone = "neutral",
  className = "",
  compact = false,
}: MetricTileProps) {
  if (compact) {
    return (
      <article
        className={[
          "min-w-0 overflow-hidden",
          "rounded-[22px] border border-white/10",
          "bg-black/20 p-4",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {icon ? (
            <span
              className={[
                "flex h-7 w-7 shrink-0",
                "items-center justify-center",
                "rounded-[9px] border",
                "[&>svg]:h-3.5 [&>svg]:w-3.5",
                iconClasses[tone],
              ].join(" ")}
            >
              {icon}
            </span>
          ) : null}

          <p className="min-w-0 text-[9px] font-bold uppercase leading-4 tracking-[0.1em] text-white/32">
            {label}
          </p>
        </div>

        <div
          className={[
            "mt-4 min-w-0",
            "text-[clamp(1.3rem,2.2vw,1.7rem)]",
            "font-black leading-none",
            "tracking-[-0.035em]",
            "whitespace-nowrap",
            valueClasses[tone],
          ].join(" ")}
        >
          {value}
        </div>

        {detail ? (
          <div className="mt-3 min-w-0 text-[11px] leading-5 text-white/30">
            {detail}
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <article
      className={[
        "min-w-0",
        "rounded-[22px] border border-white/10",
        "bg-black/20 p-5",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-white/30">
            {label}
          </p>

          <div
            className={[
              "mt-3",
              "text-[clamp(1.6rem,6vw,2.35rem)]",
              "font-black leading-[1.05]",
              "tracking-[-0.045em]",
              "break-normal whitespace-normal",
              valueClasses[tone],
            ].join(" ")}
          >
            {value}
          </div>
        </div>

        {icon ? (
          <span
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-[13px] border",
              iconClasses[tone],
            ].join(" ")}
          >
            {icon}
          </span>
        ) : null}
      </div>

      {detail ? (
        <div className="mt-3 text-xs leading-5 text-white/30">
          {detail}
        </div>
      ) : null}
    </article>
  );
}
