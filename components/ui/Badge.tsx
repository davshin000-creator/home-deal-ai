"use client";

import { cn } from "@/lib/ui/cn";

type BadgeVariant = "default" | "buy" | "hold" | "pass" | "pro" | "risk" | "new";

const variants: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700",
  buy: "bg-black text-white",
  hold: "bg-amber-100 text-amber-800",
  pass: "bg-red-100 text-red-700",
  pro: "bg-indigo-100 text-indigo-700",
  risk: "bg-orange-100 text-orange-800",
  new: "bg-green-100 text-green-700",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]", variants[variant], className)}>
      {children}
    </span>
  );
}
