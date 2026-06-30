"use client";

import { cn } from "@/lib/ui/cn";

export default function Textarea({
  label,
  hint,
  error,
  className,
  textareaClassName,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  textareaClassName?: string;
}) {
  return (
    <label className={cn("grid gap-2", className)}>
      {label && <span className="text-sm font-semibold text-neutral-800">{label}</span>}

      <textarea
        className={cn(
          "min-h-[120px] rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-neutral-950 outline-none transition duration-200 placeholder:text-neutral-400 focus:border-black/30 focus:ring-4 focus:ring-black/5 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          textareaClassName
        )}
        {...props}
      />

      {hint && !error && <span className="text-xs text-neutral-500">{hint}</span>}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}
