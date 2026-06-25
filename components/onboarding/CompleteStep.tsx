"use client";

export default function CompleteStep({ onFinish }: { onFinish: () => void }) {
  return (
    <section className="rounded-3xl border-2 border-black bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Complete
      </p>

      <h1 className="mt-2 text-5xl font-bold">You’re ready to use Nestrova 🎉</h1>

      <p className="mt-5 max-w-2xl text-lg text-gray-600">
        You completed the first workflow: analyze, save, and create an AI strategy.
        Next, try generating an AI report or finding deals in your target market.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          "First Analysis",
          "Portfolio Started",
          "Coach Preview",
        ].map((achievement) => (
          <div key={achievement} className="rounded-2xl bg-gray-50 p-5">
            <p className="text-xl font-bold">🏅 {achievement}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-black p-6 text-white">
        <p className="text-xl font-bold">Pro unlocks the full workflow</p>
        <p className="mt-2 text-gray-300">
          AI Offer Generator PDF, unlimited Coach, weekly reports, and more.
        </p>
      </div>

      <button
        onClick={onFinish}
        className="mt-8 rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
      >
        Continue to Dashboard
      </button>
    </section>
  );
}
