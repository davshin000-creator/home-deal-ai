"use client";

export default function WeeklyReportEmpty() {
  return (
    <section className="rounded-[28px] border border-dashed border-black/15 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-xl">
        ◇
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        No weekly report yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
        This area is ready. Add your first item to start building your Nestrova workspace.
      </p>
    </section>
  );
}
