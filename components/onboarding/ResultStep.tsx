"use client";

export default function ResultStep({
  address,
  onContinue,
}: {
  address?: string;
  onContinue?: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        Review your first result
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        {address
          ? `Nestrova prepared an example result for ${address}.`
          : "Nestrova prepared an example result for your property."}
      </p>

      <button
        onClick={onContinue}
        className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
      >
        Continue
      </button>
    </section>
  );
}

