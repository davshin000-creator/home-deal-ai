"use client";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function IntelligenceHero({ data }: { data: any }) {
  return (
    <section className="rounded-3xl border-2 border-black bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Powered by Nestrova Intelligence
      </p>

      <h1 className="mt-2 text-5xl font-bold tracking-tight">
        {getGreeting()}, {data.user_name} ☀️
      </h1>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="rounded-3xl bg-gray-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Today's Intelligence
          </p>
          <p className="mt-3 text-xl font-semibold text-gray-900">
            {data.daily_brief}
          </p>
        </div>

        <div className="rounded-3xl bg-black p-6 text-white">
          <p className="text-sm font-semibold text-gray-300">Intelligence Score</p>
          <p className="mt-3 text-6xl font-bold">{data.intelligence_score}</p>
          <p className="mt-2 text-gray-300">{data.intelligence_label}</p>
        </div>
      </div>
    </section>
  );
}
