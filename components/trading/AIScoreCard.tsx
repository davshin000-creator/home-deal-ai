type AIScoreCardProps = {
  score: number;
  bullProbability: number;
  recommendation: string;
};

export default function AIScoreCard({
  score,
  bullProbability,
  recommendation,
}: AIScoreCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
        AI Conviction
      </p>

      <div className="mt-5 flex items-end gap-2">
        <span className="text-6xl font-bold tracking-tight text-slate-950">
          {score}
        </span>
        <span className="pb-2 text-xl font-semibold text-slate-400">/100</span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-slate-600">Bull probability</span>
          <span className="font-bold text-slate-950">
            {bullProbability}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900"
            style={{ width: bullProbability + "%" }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recommendation
        </p>
        <p className="mt-1 text-xl font-bold text-slate-950">
          {recommendation}
        </p>
      </div>
    </section>
  );
}