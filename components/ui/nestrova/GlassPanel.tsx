import type {
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";

type GlassPanelTone =
  | "neutral"
  | "cyan"
  | "violet"
  | "emerald"
  | "amber"
  | "red";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  tone?: GlassPanelTone;
  glow?: boolean;
  hover?: boolean;
  as?: ElementType;
} & HTMLAttributes<HTMLElement>;

const toneClasses: Record<
  GlassPanelTone,
  string
> = {
  neutral:
    "border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))]",
  cyan:
    "border-cyan-300/15 bg-[linear-gradient(145deg,rgba(34,211,238,0.09),rgba(255,255,255,0.025))]",
  violet:
    "border-violet-300/15 bg-[linear-gradient(145deg,rgba(139,92,246,0.10),rgba(255,255,255,0.025))]",
  emerald:
    "border-emerald-300/15 bg-[linear-gradient(145deg,rgba(52,211,153,0.09),rgba(255,255,255,0.025))]",
  amber:
    "border-amber-300/15 bg-[linear-gradient(145deg,rgba(251,191,36,0.09),rgba(255,255,255,0.025))]",
  red:
    "border-red-300/15 bg-[linear-gradient(145deg,rgba(248,113,113,0.09),rgba(255,255,255,0.025))]",
};

const glowClasses: Record<
  GlassPanelTone,
  string
> = {
  neutral: "bg-white/[0.05]",
  cyan: "bg-cyan-300/10",
  violet: "bg-violet-400/10",
  emerald: "bg-emerald-300/10",
  amber: "bg-amber-300/10",
  red: "bg-red-300/10",
};

export default function GlassPanel({
  children,
  className = "",
  contentClassName = "",
  tone = "neutral",
  glow = true,
  hover = false,
  as: Component = "section",
  ...props
}: GlassPanelProps) {
  return (
    <Component
      className={[
        "group relative min-w-0 overflow-hidden",
        "rounded-[32px] border",
        "shadow-[0_28px_90px_rgba(0,0,0,0.32)]",
        "backdrop-blur-2xl",
        "transition duration-300",
        toneClasses[tone],
        hover
          ? "hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_36px_120px_rgba(0,0,0,0.42)]"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {glow ? (
        <div
          className={[
            "pointer-events-none absolute",
            "-right-24 -top-24",
            "h-64 w-64 rounded-full",
            "blur-3xl",
            glowClasses[tone],
          ].join(" ")}
        />
      ) : null}

      <div
        className={[
          "relative min-w-0",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </Component>
  );
}
