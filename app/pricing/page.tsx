export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">← Back to Nestrova</a>

        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Pricing</p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-gray-900">Simple plans for smarter property decisions.</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Start free and upgrade when you need deeper analysis, deal alerts, and property comparison tools.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Free</p>
            <h2 className="mt-3 text-4xl font-bold">$0</h2>
            <p className="mt-2 text-gray-600">For testing basic property analysis.</p>
            <ul className="mt-6 space-y-3 text-gray-700">
              <li>✓ Up to 10 property analyses per month</li>
              <li>✓ Top 5 deals per search</li>
              <li>✓ Basic AI fair value analysis</li>
              <li>✓ Cash flow estimate</li>
            </ul>
            <a href="/" className="mt-8 block rounded-xl border px-5 py-3 text-center font-semibold hover:bg-gray-50">Start Free</a>
          </div>

          <div className="rounded-3xl border-2 border-black bg-black p-8 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-300">Pro</p>
            <h2 className="mt-3 text-4xl font-bold">$19/mo</h2>
            <p className="mt-2 text-gray-300">For investors who want stronger deal discovery and monitoring.</p>
            <ul className="mt-6 space-y-3 text-gray-100">
              <li>✓ 50 property analyses per month</li>
              <li>✓ 10 deal searches per month</li>
              <li>✓ Property comparison</li>
              <li>✓ Deal alerts</li>
              <li>✓ Watchlist and saved deals dashboard</li>
              <li>✓ Forecast and neighborhood scoring</li>
            </ul>
            <a href="/" className="mt-8 block rounded-xl bg-white px-5 py-3 text-center font-semibold text-black hover:bg-gray-100">Upgrade from the app</a>
          </div>
        </section>

        <p className="mt-8 text-sm text-gray-500">
          Nestrova provides informational software tools only. It does not provide financial, investment, legal, tax, lending, brokerage, or real estate advisory services.
        </p>
      </div>
    </main>
  );
}
