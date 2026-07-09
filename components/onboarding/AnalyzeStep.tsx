"use client";

export default function AnalyzeStep({
  address,
  setAddress,
  onContinue,
}: {
  address?: string;
  setAddress?: (value: string) => void;
  onContinue?: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        Analyze your first property
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Enter a property address to start your first AI analysis.
      </p>

      <input
        value={address || ""}
        onChange={(e) => setAddress?.(e.target.value)}
        placeholder="123 Main St, Irvine, CA"
        className="mt-5 h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none"
      />

      <button
        onClick={onContinue}
        className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
      >
        Continue
      </button>
    </section>
  );
}

