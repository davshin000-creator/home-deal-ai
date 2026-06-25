"use client";

export default function CoachStep({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        AI Investment Coach
      </p>

      <h1 className="mt-2 text-4xl font-bold">Build your first AI strategy</h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        The AI Investment Coach helps users choose markets, risk levels, target
        yield, and next actions based on their investment goals.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["Budget", "$900k"],
          ["Risk", "Medium"],
          ["Goal", "Cash flow + appreciation"],
        ].map(([title, value]) => (
          <div key={title} className="rounded-2xl bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="mt-8 rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
      >
        Generate Coach Preview
      </button>
    </section>
  );
}
