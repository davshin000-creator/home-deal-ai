export default function LaunchPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
          Back to Nestrova
        </a>

        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Beta Launch
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
            Nestrova Beta is getting ready
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-gray-600">
            AI property analysis, deal finder, portfolio tracking, negotiation strategy,
            and investment insights in one place.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <a href="/deals" className="rounded-2xl border bg-white p-5 font-semibold shadow-sm hover:bg-gray-50">
              Find Deals
            </a>
            <a href="/portfolio" className="rounded-2xl border bg-white p-5 font-semibold shadow-sm hover:bg-gray-50">
              View Portfolio
            </a>
            <a href="/feedback" className="rounded-2xl border-2 border-black bg-black p-5 font-semibold text-white shadow-sm hover:bg-gray-800">
              Give Feedback
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["AI Analysis", "Estimate fair value, rent, cash flow, and investment score."],
            ["Deal Finder", "Search markets and rank properties by investment quality."],
            ["AI Negotiation", "Generate a practical offer strategy before making a move."],
            ["Portfolio", "Save and compare your best opportunities."],
            ["AI Chat", "Ask property-specific questions after analysis."],
            ["Market Heat Map", "See which markets look most attractive."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-2 text-gray-600">{body}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}


