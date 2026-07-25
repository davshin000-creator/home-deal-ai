type AssetHeaderProps = {
  symbol: string;
  recommendation: string;
  risk: string;
};

export default function AssetHeader({
  symbol,
  recommendation,
  risk,
}: AssetHeaderProps) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Nestrova Asset Intelligence
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {symbol}
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            AI-generated market outlook, risk assessment, price targets, and
            executive council analysis.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {recommendation}
          </span>

          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Risk: {risk}
          </span>
        </div>
      </div>
    </header>
  );
}