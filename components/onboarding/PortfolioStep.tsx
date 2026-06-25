"use client";

export default function PortfolioStep({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Portfolio
      </p>

      <h1 className="mt-2 text-4xl font-bold">Save your best opportunities</h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Portfolio lets you compare saved properties, track average score, yield,
        cash flow, and identify your strongest deal.
      </p>

      <div className="mt-6 rounded-2xl bg-gray-50 p-6">
        <p className="text-xl font-bold">🏅 Achievement unlocked</p>
        <p className="mt-2 text-gray-600">First Portfolio Workflow</p>
      </div>

      <button
        onClick={onContinue}
        className="mt-8 rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
      >
        Continue
      </button>
    </section>
  );
}
