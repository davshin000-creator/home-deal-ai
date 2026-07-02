"use client";

type CardVariant = "default" | "elevated" | "glass" | "ai" | "inverse" | "premium";

const variants: Record<CardVariant, string> = {
  default: "border border-black/10 bg-white shadow-sm text-neutral-950",
  elevated: "border border-black/10 bg-white shadow-xl text-neutral-950",
  glass: "border border-white/60 bg-white/75 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl text-neutral-950",
  ai: "border border-indigo-200 bg-indigo-50 shadow-sm text-neutral-950",
  inverse: "border border-white/10 bg-[#050505] text-white shadow-[0_28px_90px_rgba(0,0,0,0.45)]",
  premium: "border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),rgba(255,255,255,0.055)_35%,rgba(255,255,255,0.035))] text-white shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl",
};

export default function Card({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: CardVariant; className?: string }) {
  return <section className={["rounded-[32px] p-6 transition duration-300 ease-out", variants[variant], className].join(" ")}>{children}</section>;
}
