"use client";

import { InputHTMLAttributes } from "react";

export default function SearchInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={["relative", className].join(" ")}>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
        ⌕
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-10 pr-4 text-sm text-neutral-950 outline-none transition duration-200 placeholder:text-neutral-400 focus:border-black/30 focus:ring-4 focus:ring-black/5"
        placeholder="Search..."
        {...props}
      />
    </div>
  );
}
