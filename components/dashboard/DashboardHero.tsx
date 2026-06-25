"use client";

type DashboardData = {
  user_name: string;
  portfolio_count: number;
  avg_deal_score: number;
  ai_brief: string;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHero({ data }: { data: DashboardData }) {
  return (
    <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Nestrova Dashboard
      </p>

      <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
        {getGreeting()}, {data.user_name} 👋
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-gray-600">
        Your AI real estate investment workspace is ready.
      </p>

      <div className="mt-8 rounded-2xl border-2 border-black bg-gray-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Today's AI Brief
        </p>
        <p className="mt-3 text-lg text-gray-800">{data.ai_brief}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Analyze", "/"],
          ["Find Deals", "/deals"],
          ["AI Coach", "/coach"],
          ["Portfolio", "/portfolio"],
          ["Pricing", "/pricing"],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="rounded-xl bg-black px-5 py-4 text-center font-semibold text-white hover:bg-gray-800"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
