"use client";

export default function DashboardHero() {
  return (
    <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Nestrova Dashboard
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-950">
        Real estate intelligence workspace
      </h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Analyze properties, compare opportunities, and generate AI-powered investment decisions.
      </p>
    </section>
  );
}
