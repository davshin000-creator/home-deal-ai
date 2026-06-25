"use client";

const SAMPLES = [
  "14851 Jeffrey Rd, Irvine, CA",
  "123 Main St, Dallas, TX",
  "88 Brickell Ave, Miami, FL",
];

export default function AnalyzeStep({
  address,
  setAddress,
  onContinue,
}: {
  address: string;
  setAddress: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <section className="rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        First Analysis
      </p>

      <h1 className="mt-2 text-4xl font-bold">Analyze your first property</h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Enter a property address or try one of the sample markets. This step helps
        you see how Nestrova evaluates deal quality.
      </p>

      <div className="mt-6 grid gap-4">
        <input
          className="rounded-xl border p-4"
          placeholder="Enter property address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((sample) => (
            <button
              key={sample}
              onClick={() => setAddress(sample)}
              className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Try {sample.split(",")[1]?.trim() || sample}
            </button>
          ))}
        </div>

        <button
          onClick={onContinue}
          className="rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
        >
          Continue
        </button>
      </div>
    </section>
  );
}
