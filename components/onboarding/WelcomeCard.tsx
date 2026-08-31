"use client";

export default function WelcomeCard({
  onStart,
  onSkip,
}: {
  onStart?: () => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
}) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.045] p-8 text-white md:p-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
          Welcome to Nestrova
        </p>

        <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.055em] md:text-5xl">
          Set up your intelligence workspace.
        </h2>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
          Personalize your Nestrova experience across real estate, trading, and research.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={onStart}
            className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Start setup
          </button>

          <button
            onClick={onSkip}
            className="rounded-full border border-white/12 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.09] hover:text-white"
          >
            Skip for now
          </button>
        </div>
      </div>
    </section>
  );
}
