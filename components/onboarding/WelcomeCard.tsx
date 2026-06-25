"use client";

export default function WelcomeCard({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <section className="rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Welcome
      </p>

      <h1 className="mt-3 text-5xl font-bold tracking-tight text-gray-900">
        Welcome to Nestrova 👋
      </h1>

      <p className="mt-5 max-w-2xl text-lg text-gray-600">
        Let’s complete your first AI investment workflow. In about 2 minutes,
        you’ll analyze a property, save it, and create your first AI strategy.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-xl font-bold">1. Analyze</p>
          <p className="mt-2 text-gray-600">Run your first AI property analysis.</p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-xl font-bold">2. Save</p>
          <p className="mt-2 text-gray-600">Create your first portfolio item.</p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-xl font-bold">3. Coach</p>
          <p className="mt-2 text-gray-600">Generate your first AI investment plan.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onStart}
          className="rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
        >
          Start Onboarding
        </button>

        <button
          onClick={onSkip}
          className="rounded-xl border px-6 py-4 font-semibold hover:bg-gray-50"
        >
          Skip for now
        </button>
      </div>
    </section>
  );
}
