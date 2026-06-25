"use client";

export default function ResultStep({ address, onContinue }: { address: string; onContinue: () => void }) {
  return (
    <section className="rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        AI Result Preview
      </p>

      <h1 className="mt-2 text-4xl font-bold">Great. Your first analysis is ready.</h1>

      <p className="mt-4 text-gray-600">
        Nestrova would now analyze:
      </p>

      <div className="mt-4 rounded-2xl border-2 border-black bg-gray-50 p-5">
        <p className="text-xl font-bold">{address || "Sample Property"}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["AI Fair Value", "Estimate value"],
          ["Deal Score", "Rank quality"],
          ["Cash Flow", "Project return"],
          ["Forecast", "Estimate upside"],
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl bg-gray-50 p-5">
            <p className="font-bold">{title}</p>
            <p className="mt-1 text-sm text-gray-600">{body}</p>
          </div>
        ))}
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
