"use client";

export default function WelcomeCard({
  onStart,
  onSkip,
}: {
  onStart?: () => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        Welcome to Nestrova
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Set up your workspace and start analyzing real estate opportunities.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onStart}
          className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          Start
        </button>

        <button
          onClick={onSkip}
          className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold text-neutral-700"
        >
          Skip
        </button>
      </div>
    </section>
  );
}

