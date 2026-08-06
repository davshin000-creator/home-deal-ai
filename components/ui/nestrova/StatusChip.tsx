import type { ReactNode } from "react";

type StatusTone =
  | "neutral"
  | "cyan"
  | "violet"
  | "emerald"
  | "amber"
  | "red";

type StatusChipProps = {
  children: ReactNode;
  icon?: ReactNode;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<
  StatusTone,
  string
> = {
  neutral:
    "border-white/10 bg-white/[0.055] text-white/50",
  cyan:
    "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
  violet:
    "border-violet-300/20 bg-violet-300/10 text-violet-200",
  emerald:
    "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  amber:
    "border-amber-300/20 bg-amber-300/10 text-amber-100",
  red:
    "border-red-300/20 bg-red-300/10 text-red-200",
};

export default function StatusChip({
  children,
  icon,
  tone = "neutral",
  className = "",
}: StatusChipProps) {
  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-1.5",
        "rounded-full border px-3 py-1.5",
        "text-[10px] font-bold uppercase",
        "leading-none tracking-[0.12em]",
        toneClasses[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? (
        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
          {icon}
        </span>
      ) : null}

      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
        {children}
      </span>
    </span>
  );
}
