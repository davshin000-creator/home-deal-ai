"use client";

import { cn } from "@/lib/ui/cn";

type CardVariant = "default" | "elevated" | "glass" | "ai" | "inverse";

const variants: Record<CardVariant, string> = {
  default: "border border-black/10 bg-white shadow-sm",
  elevated: "border border-black/10 bg-white shadow-md",
  glass: "border border-black/10 bg-white/80 shadow-sm backdrop-blur",
  ai: "border border-indigo-200 bg-indigo-50 shadow-sm",
  inverse: "border border-white/10 bg-black text-white shadow-sm",
};

export default function Card({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[28px] p-6 transition duration-200 ease-out hover:shadow-md", variants[variant], className)}>
      {children}
    </section>
  );
}
