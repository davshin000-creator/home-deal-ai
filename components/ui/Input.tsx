"use client";

import { InputHTMLAttributes } from "react";

export default function Input({
  label,
  hint,
  error,
  className = "",
  inputClassName = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  inputClassName?: string;
}) {
  return (
    <label className={["grid gap-2", className].join(" ")}>
      {label && <span className="text-sm font-semibold text-neutral-800">{label}</span>}
      <input
        className={[
          "h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition duration-200 placeholder:text-neutral-400 focus:border-black/30 focus:ring-4 focus:ring-black/5 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400",
          error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "",
          inputClassName,
        ].join(" ")}
        {...props}
      />
      {hint && !error && <span className="text-xs text-neutral-500">{hint}</span>}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

