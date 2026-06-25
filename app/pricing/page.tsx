export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
          ← Back to Nestrova
        </a>

        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Pricing
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
            Simple plans for smarter property decisions.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Start free, then upgrade when you need deeper analysis, AI reports,
            coaching, deal alerts, and advanced portfolio tools.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Free
            </p>
            <h2 className="mt-3 text-4xl font-bold">$0</h2>
            <p className="mt-2 text-gray-600">
              For testing basic property analysis.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li>✓ Limited monthly property analyses</li>
              <li>✓ Basic AI fair value analysis</li>
              <li>✓ Basic cash flow estimate</li>
              <li>✓ Portfolio preview</li>
              <li>✓ Limited AI questions</li>
              <li>✓ Report preview only</li>
            </ul>

            <a
              href="/"
              className="mt-8 block rounded-xl border px-5 py-3 text-center font-semibold hover:bg-gray-50"
            >
              Start Free
            </a>
          </div>

          <div className="rounded-3xl border-2 border-black bg-black p-8 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Pro
            </p>
            <h2 className="mt-3 text-4xl font-bold">$19/mo</h2>
            <p className="mt-2 text-gray-300">
              For investors who want AI-powered decision support.
            </p>

            <ul className="mt-6 space-y-3 text-white">
              <li>✓ 50 property analyses / month</li>
              <li>✓ 10 AI deal searches / month</li>
              <li>✓ AI Offer Generator PDF</li>
              <li>✓ AI Investment Coach</li>
              <li>✓ AI Negotiation Assistant</li>
              <li>✓ AI Chat for property questions</li>
              <li>✓ Portfolio insights and property compare</li>
              <li>✓ Daily deal alerts</li>
              <li>✓ Market Heat Map</li>
              <li>✓ Priority feature access</li>
            </ul>

            <a
              href="mailto:support@nestrova.com?subject=Nestrova Pro Access"
              className="mt-8 block rounded-xl bg-white px-5 py-3 text-center font-semibold text-black hover:bg-gray-100"
            >
              Join Pro Waitlist
            </a>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">What is included in Pro?</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [
                "AI Offer Generator PDF",
                "Generate a branded investment report with fair value, cash flow, forecast, risks, and negotiation strategy.",
              ],
              [
                "AI Investment Coach",
                "Create a strategy based on budget, risk level, goals, time horizon, and target markets.",
              ],
              [
                "AI Deal Finder",
                "Search and rank potential opportunities by score, yield, discount, and cash flow.",
              ],
              [
                "AI Negotiation Assistant",
                "Generate offer price ideas, concessions to ask for, and due diligence steps.",
              ],
              [
                "Portfolio Insights",
                "Track saved deals, average yield, portfolio value, and strongest opportunities.",
              ],
              [
                "Compare Properties",
                "Compare multiple saved properties side by side before making decisions.",
              ],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl bg-gray-50 p-5">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Important disclaimer</h2>
          <p className="mt-3 text-gray-600">
            Nestrova provides informational real estate analysis only. It is not
            financial, legal, tax, mortgage, or investment advice. Always verify
            data with licensed professionals before making investment decisions.
          </p>
        </section>
      </div>
    </main>
  );
}
