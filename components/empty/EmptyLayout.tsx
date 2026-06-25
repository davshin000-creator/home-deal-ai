"use client";

import Link from "next/link";

type EmptyLayoutProps = {
  icon: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  aiTipBody?: string;
};

export default function EmptyLayout({
  icon,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  aiTipBody = "Start with a strong market and save your best opportunities to build your investment workflow.",
}: EmptyLayoutProps) {
  return (
    <section className="rounded-3xl border bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-4xl">
        {icon}
      </div>

      <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-gray-600">{description}</p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={primaryHref}
          className="rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
        >
          {primaryLabel}
        </Link>

        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="rounded-xl border px-6 py-4 font-semibold hover:bg-gray-50"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-2xl border bg-gray-50 p-5 text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          🤖 AI Suggestion
        </p>
        <p className="mt-2 text-gray-700">{aiTipBody}</p>
      </div>
    </section>
  );
}
