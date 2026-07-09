"use client";

export default function CoachStep({
  onContinue,
}: {
  onContinue?: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        Meet your AI coach
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Nestrova will guide your next best actions across analysis, offers, and portfolio decisions.
      </p>

      <button
        onClick={onContinue}
        className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
      >
        Finish
      </button>
    </section>
  );
}

