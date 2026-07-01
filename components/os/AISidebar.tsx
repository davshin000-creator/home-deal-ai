"use client";

const insights = [
  "Run AI decision for the current property.",
  "Review risks before generating offer.",
  "Compare with nearby alternatives.",
];

export default function AISidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-73px)] border-l border-black/10 bg-white p-4 xl:block">
      <div className="rounded-[28px] border border-black/10 bg-neutral-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          AI Assistant
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
          Next actions
        </h2>

        <div className="mt-5 grid gap-3">
          {insights.map((item) => (
            <div key={item} className="rounded-2xl bg-white p-4 text-sm leading-6 text-neutral-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
