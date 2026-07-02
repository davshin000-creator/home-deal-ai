"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "ai" | "danger" | "success" | "premium";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-black text-white hover:bg-neutral-800",
  secondary: "border border-black/10 bg-white text-neutral-900 hover:bg-neutral-50",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-black",
  ai: "bg-indigo-600 text-white hover:bg-indigo-500",
  danger: "bg-red-600 text-white hover:bg-red-500",
  success: "bg-green-600 text-white hover:bg-green-500",
  premium: "bg-white text-black shadow-[0_18px_55px_rgba(255,255,255,0.22)] hover:bg-neutral-200",
};

const sizes: Record<ButtonSize, string> = { sm: "h-10 px-4 text-sm", md: "h-12 px-5 text-sm", lg: "h-14 px-6 text-base" };

export default function Button({ children, variant = "primary", size = "md", loading = false, className = "", disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean }) {
  return (
    <button className={["inline-flex items-center justify-center rounded-2xl font-semibold transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-black/20 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]", variants[variant], sizes[size], className].join(" ")} disabled={disabled || loading} {...props}>
      {loading ? "Loading..." : children}
    </button>
  );
}
