import Link from "next/link";

const FEATURES = [
  "Unlimited AI property analysis",
  "AI Offer Generator",
  "Negotiation Engine",
  "Printable Offer Documents",
  "AI Investment Coach",
  "Weekly Intelligence",
  "Portfolio Insights",
  "Priority AI workflow",
];

export default function ProPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
          ← Back to Nestrova
        </a>

        <section className="mt-8 rounded-3xl border-2 border-black bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Nestrova Pro
          </p>

          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Unlock the full AI investment workflow.
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Go from discovery to analysis, scenario, offer strategy, negotiation, and document export.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-3xl bg-black p-8 text-white">
            <p className="text-gray-300">Pro Plan</p>
            <p className="mt-2 text-6xl font-bold">$29</p>
            <p className="mt-2 text-gray-300">per month</p>

            <Link
              href="/pricing"
              className="mt-6 block rounded-xl bg-white px-6 py-4 font-semibold text-black hover:bg-gray-100"
            >
              Continue to Pricing
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xl font-bold">✓ {feature}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Free vs Pro</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border p-6">
              <h3 className="text-2xl font-bold">Free</h3>
              <ul className="mt-4 grid gap-2 text-gray-700">
                <li>✓ 5 analyses</li>
                <li>✓ 1 AI report</li>
                <li>✓ 1 AI coach plan</li>
                <li>✓ Simulator access</li>
                <li>✕ Full offer documents</li>
              </ul>
            </div>

            <div className="rounded-3xl border-2 border-black p-6">
              <h3 className="text-2xl font-bold">Pro</h3>
              <ul className="mt-4 grid gap-2 text-gray-700">
                <li>✓ Unlimited analysis</li>
                <li>✓ Unlimited AI reports</li>
                <li>✓ Offer Generator</li>
                <li>✓ Negotiation Engine</li>
                <li>✓ Document export</li>
                <li>✓ Weekly Intelligence</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
