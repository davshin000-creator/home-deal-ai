import ScenarioSimulator from "@/components/simulator/ScenarioSimulator";

export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
          ??Back to Nestrova
        </a>

        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Investment Scenario Simulator
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Test your real estate numbers before making an offer.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Adjust purchase price, financing, rent, taxes, insurance, vacancy,
            and expenses to see estimated cash flow, ROI, cap rate, and cash needed.
          </p>
        </section>

        <div className="mt-8">
          <ScenarioSimulator />
        </div>
      </div>
    </main>
  );
}

