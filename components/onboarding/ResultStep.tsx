"use client";

export default function ResultStep({
  address,
  onContinue,
}: {
  address?: string;
  onContinue?: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-8 text-white md:p-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
        Step 2
      </p>

      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
        See how Nestrova thinks.
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        {address
          ? `Here is an example of the intelligence Nestrova can organize for ${address}.`
          : "Here is an example of the intelligence Nestrova can organize for your property."}
      </p>

      <div className="mt-7 rounded-[26px] border border-white/10 bg-black/20 p-5 md:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          Example preview
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="text-xs text-white/35">
              Deal Score
            </p>
            <p className="mt-2 text-xl font-semibold">
              Clear signal
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="text-xs text-white/35">
              Opportunity
            </p>
            <p className="mt-2 text-xl font-semibold">
              AI insights
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="text-xs text-white/35">
              Risk
            </p>
            <p className="mt-2 text-xl font-semibold">
              Explained
            </p>
          </div>
        </div>
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
