import Link from "next/link";

const features = [
  {
    title: "Market Intelligence",
    description: "Understand the current crypto market regime, confidence, and risk.",
  },
  {
    title: "AI Council",
    description: "Review the combined view of Nestrova research agents.",
  },
  {
    title: "Shadow Research",
    description: "See strategies tracked without exposing real orders or private accounts.",
  },
  {
    title: "Verified Strategies",
    description: "Explore strategies that meet Nestrova internal research standards.",
  },
];

export default function TradingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Nestrova Intelligence
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Trading Intelligence built on continuous AI research.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Market regimes, AI council analysis, shadow research, strategy
            performance, and verified intelligence—without connecting user
            accounts or executing trades.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/trading/markets"
              className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Explore markets
            </Link>

            <Link
              href="/"
              className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-slate-500"
            >
              Back to Nestrova
            </Link>
          </div>
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7"
            >
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <p className="mt-12 text-sm leading-6 text-slate-500">
          Nestrova Trading provides simulated research and educational market
          intelligence. It does not provide brokerage services, personalized
          financial advice, or guaranteed results.
        </p>
      </div>
    </main>
  );
}
