"use client";

export default function CompleteStep({
  onFinish,
}: {
  onFinish?: () => void | Promise<void>;
}) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-8 text-white md:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white text-black">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              d="m6.5 12.5 3.5 3.5 7.5-8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
          Setup complete
        </p>

        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
          Your Nestrova workspace is ready.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
          Explore real estate, trading, and research intelligence from one connected workspace.
        </p>

        <button
          onClick={onFinish}
          className="mt-7 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          Enter Nestrova
        </button>
      </div>
    </section>
  );
}
