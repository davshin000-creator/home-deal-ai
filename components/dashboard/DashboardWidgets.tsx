"use client";

type DashboardData = {
  portfolio_count: number;
  avg_deal_score: number;
  saved_deals: number;
  ai_reports: number;
  coach_plans: number;
  watchlist_count: number;
  weekly_reports: number;
  recent_activity: Array<{
    title: string;
    description: string;
    href: string;
  }>;
};

function WidgetCard({
  title,
  value,
  body,
  href,
}: {
  title: string;
  value: string | number;
  body: string;
  href: string;
}) {
  return (
    <a href={href} className="rounded-3xl border bg-white p-6 shadow-sm hover:bg-gray-50">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
      <p className="mt-2 text-gray-600">{body}</p>
    </a>
  );
}

export default function DashboardWidgets({ data }: { data: DashboardData }) {
  return (
    <section className="mt-8 grid gap-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <WidgetCard
          title="Portfolio"
          value={data.portfolio_count}
          body={`Average deal score: ${data.avg_deal_score}/100`}
          href="/portfolio"
        />

        <WidgetCard
          title="AI Reports"
          value={data.ai_reports}
          body="Generate and open branded investment reports."
          href="/"
        />

        <WidgetCard
          title="AI Coach"
          value={data.coach_plans}
          body="Create strategy plans based on budget and risk."
          href="/coach"
        />

        <WidgetCard
          title="Watchlist"
          value={data.watchlist_count}
          body="Track properties before making a move."
          href="/watchlist"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">AI Picks Today</h2>
          <p className="mt-2 text-gray-600">
            Start with these markets while Nestrova learns your investment style.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ["Dallas", "Cash-flow potential"],
              ["Austin", "Growth market"],
              ["Phoenix", "Balanced opportunity"],
            ].map(([market, reason]) => (
              <a
                key={market}
                href={`/deals?city=${market}`}
                className="rounded-2xl border bg-gray-50 p-5 hover:bg-gray-100"
              >
                <p className="text-xl font-bold">{market}</p>
                <p className="mt-1 text-sm text-gray-600">{reason}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Recent Activity</h2>

          <div className="mt-5 grid gap-3">
            {data.recent_activity.length === 0 && (
              <p className="text-gray-600">
                No activity yet. Analyze a property or generate a coach plan to begin.
              </p>
            )}

            {data.recent_activity.map((item, index) => (
              <a
                key={`${item.title}-${index}`}
                href={item.href}
                className="rounded-2xl border p-4 hover:bg-gray-50"
              >
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
