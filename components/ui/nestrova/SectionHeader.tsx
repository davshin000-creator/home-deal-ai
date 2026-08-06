import type { ReactNode } from "react";

type SectionHeaderTone =
  | "neutral"
  | "cyan"
  | "violet"
  | "emerald"
  | "amber";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: SectionHeaderTone;
  className?: string;
};

const toneClasses: Record<
  SectionHeaderTone,
  string
> = {
  neutral: "text-white/38",
  cyan: "text-cyan-200/70",
  violet: "text-violet-200/70",
  emerald: "text-emerald-200/70",
  amber: "text-amber-200/70",
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  icon,
  action,
  tone = "neutral",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={[
        "flex min-w-0 flex-col gap-5",
        "sm:flex-row sm:items-start sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <div
            className={[
              "flex items-center gap-2",
              "text-[10px] font-bold uppercase",
              "tracking-[0.2em]",
              toneClasses[tone],
            ].join(" ")}
          >
            {icon ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border border-current/15 bg-current/[0.07]">
                {icon}
              </span>
            ) : null}

            <span>{eyebrow}</span>
          </div>
        ) : null}

        <h2 className="mt-3 max-w-full break-words text-[clamp(1.7rem,3.2vw,2.45rem)] font-black leading-[1.02] tracking-[-0.055em] text-white [overflow-wrap:anywhere]">
          {title}
        </h2>

        {description ? (
          <div className="mt-3 max-w-3xl text-sm leading-7 text-white/42">
            {description}
          </div>
        ) : null}
      </div>

      {action ? (
        <div className="shrink-0">
          {action}
        </div>
      ) : null}
    </div>
  );
}
