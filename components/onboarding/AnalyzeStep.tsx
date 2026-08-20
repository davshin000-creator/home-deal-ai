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
    <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-8 text-white md:p-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
        Step 1
      </p>

      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
        Analyze your first property
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
        Enter a property address to start your first AI analysis.
      </p>

      <input
        value={address || ""}
        onChange={(e) => setAddress?.(e.target.value)}
        placeholder="123 Main St, Irvine, CA"
        className="mt-7 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/[0.07]"
      />

      <button
        onClick={onContinue}
        className="mt-5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
      >
        Continue
      </button>
    </section>
  );
}
