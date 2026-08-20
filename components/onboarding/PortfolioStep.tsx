"use client";

export default function PortfolioStep({
  onContinue,
}: {
  onContinue?: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-8 text-white md:p-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
        Step 3
      </p>

      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
        Build your investment workspace.
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        Save opportunities, compare assets, and keep your investment pipeline organized in one place.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          ["Save", "Keep promising opportunities organized."],
          ["Compare", "Review assets side by side with clearer context."],
          ["Track", "Follow your pipeline as decisions evolve."],
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-[22px] border border-white/10 bg-black/20 p-5"
          >
            <p className="text-sm font-semibold">
              {title}
            </p>

            <p className="mt-2 text-xs leading-6 text-white/40">
              {description}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="mt-6 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
      >
        Continue
      </button>
    </section>
  );
}
