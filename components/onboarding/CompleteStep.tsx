"use client";

export default function CompleteStep() {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
        ✓
      </div>

      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        You are ready to use Nestrova
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Your workspace is set up. Start by analyzing a property, saving it to your watchlist, or generating an AI decision.
      </p>
    </section>
  );
}
