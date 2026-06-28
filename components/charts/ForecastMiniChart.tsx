"use client";

const POINTS = [
  { year: "Now", value: 885000 },
  { year: "1Y", value: 914000 },
  { year: "3Y", value: 982000 },
  { year: "5Y", value: 1085000 },
];

function money(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  return `$${Math.round(value / 1000)}k`;
}

export default function ForecastMiniChart() {
  const min = Math.min(...POINTS.map((p) => p.value));
  const max = Math.max(...POINTS.map((p) => p.value));
  const range = max - min || 1;

  const chartPoints = POINTS.map((p, index) => {
    const x = (index / (POINTS.length - 1)) * 100;
    const y = 80 - ((p.value - min) / range) * 58;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Forecast
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            5-year value outlook
          </h3>
        </div>
        <p className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
          AI Estimate
        </p>
      </div>

      <div className="mt-6 h-56 w-full">
        <svg viewBox="0 0 100 90" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="forecastFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="black" stopOpacity="0.10" />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polyline
            points={chartPoints}
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polygon points={`0,82 ${chartPoints} 100,82`} fill="url(#forecastFill)" />

          {POINTS.map((p, index) => {
            const x = (index / (POINTS.length - 1)) * 100;
            const y = 80 - ((p.value - min) / range) * 58;
            return (
              <g key={p.year}>
                <circle cx={x} cy={y} r="2.4" fill="black" />
                <text x={x} y="89" textAnchor="middle" fontSize="4" fill="#737373">
                  {p.year}
                </text>
                <text x={x} y={y - 6} textAnchor="middle" fontSize="4" fill="#111">
                  {money(p.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
