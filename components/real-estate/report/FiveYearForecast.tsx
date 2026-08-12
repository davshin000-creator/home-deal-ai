type FiveYearForecastProps = {
  currentValue?: number | null;
  expectedAppreciation?: number | null;
  grossRentYield?: number | null;
  monthlyCashFlow?: number | null;
  confidence?: number | null;
};

function money(value?: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function clampRate(value?: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(-15, Math.min(20, value));
}

function projectedValue(
  startingValue: number,
  annualRate: number,
  year: number,
) {
  return (
    startingValue *
    Math.pow(1 + annualRate / 100, year)
  );
}

export default function FiveYearForecast({
  currentValue,
  expectedAppreciation,
  grossRentYield,
  monthlyCashFlow,
  confidence,
}: FiveYearForecastProps) {
  const baseValue = Math.max(
    0,
    Number(currentValue ?? 0),
  );

  if (!baseValue) {
    return null;
  }

  const baseRate = clampRate(
    expectedAppreciation,
  );

  const conservativeRate = clampRate(
    baseRate - 2,
  );

  const optimisticRate = clampRate(
    baseRate + 2,
  );

  const years = [0, 1, 2, 3, 4, 5];

  const baseValues = years.map((year) =>
    projectedValue(
      baseValue,
      baseRate,
      year,
    ),
  );

  const conservativeValues = years.map(
    (year) =>
      projectedValue(
        baseValue,
        conservativeRate,
        year,
      ),
  );

  const optimisticValues = years.map(
    (year) =>
      projectedValue(
        baseValue,
        optimisticRate,
        year,
      ),
  );

  const allValues = [
    ...baseValues,
    ...conservativeValues,
    ...optimisticValues,
  ];

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const range = Math.max(
    1,
    maxValue - minValue,
  );

  const width = 1000;
  const height = 360;
  const topPadding = 30;
  const bottomPadding = 42;
  const leftPadding = 24;
  const rightPadding = 24;

  function pointFor(
    value: number,
    index: number,
  ) {
    const usableWidth =
      width -
      leftPadding -
      rightPadding;

    const usableHeight =
      height -
      topPadding -
      bottomPadding;

    const x =
      leftPadding +
      (index / (years.length - 1)) *
        usableWidth;

    const normalized =
      (value - minValue) / range;

    const y =
      topPadding +
      usableHeight -
      normalized * usableHeight;

    return {
      x,
      y,
    };
  }

  function linePoints(values: number[]) {
    return values
      .map((value, index) => {
        const point = pointFor(
          value,
          index,
        );

        return `${point.x},${point.y}`;
      })
      .join(" ");
  }

  const fiveYearBase =
    baseValues[baseValues.length - 1];

  const fiveYearConservative =
    conservativeValues[
      conservativeValues.length - 1
    ];

  const fiveYearOptimistic =
    optimisticValues[
      optimisticValues.length - 1
    ];

  const fiveYearGain =
    fiveYearBase - baseValue;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.30)] md:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/65">
              5-Year Investment Forecast
            </p>

            <h2 className="mt-3 break-words text-3xl font-black tracking-[-0.05em] [overflow-wrap:anywhere]">
              Projected property value scenarios.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/38">
              Base, conservative, and optimistic
              scenarios derived from the current
              Nestrova appreciation forecast.
            </p>
          </div>

          <div className="shrink-0 rounded-[18px] border border-cyan-300/15 bg-cyan-300/[0.07] px-5 py-4 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200/45">
              Base Annual Forecast
            </p>

            <p className="mt-1 text-3xl font-black text-cyan-100">
              {baseRate >= 0 ? "+" : ""}
              {baseRate.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_340px]">
          <div className="min-w-0 overflow-hidden rounded-[26px] border border-white/10 bg-black/25 p-4 md:p-5">
            <div className="mb-4 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.14em]">
              <span className="text-white/35">
                — Conservative
              </span>

              <span className="text-cyan-200">
                — Base
              </span>

              <span className="text-violet-200">
                — Optimistic
              </span>
            </div>

            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full"
                role="img"
                aria-label="Five year property value forecast chart"
              >
                {[0, 1, 2, 3, 4].map(
                  (line) => {
                    const y =
                      topPadding +
                      ((height -
                        topPadding -
                        bottomPadding) /
                        4) *
                        line;

                    return (
                      <line
                        key={line}
                        x1={leftPadding}
                        x2={
                          width -
                          rightPadding
                        }
                        y1={y}
                        y2={y}
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth="1"
                      />
                    );
                  },
                )}

                <polyline
                  fill="none"
                  stroke="rgba(255,255,255,0.42)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="12 10"
                  points={linePoints(
                    conservativeValues,
                  )}
                />

                <polyline
                  fill="none"
                  stroke="rgb(103,232,249)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints(
                    baseValues,
                  )}
                />

                <polyline
                  fill="none"
                  stroke="rgb(196,181,253)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="12 10"
                  points={linePoints(
                    optimisticValues,
                  )}
                />

                {baseValues.map(
                  (value, index) => {
                    const point = pointFor(
                      value,
                      index,
                    );

                    return (
                      <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="8"
                        fill="rgb(103,232,249)"
                      />
                    );
                  },
                )}

                {years.map(
                  (year, index) => {
                    const point = pointFor(
                      baseValues[index],
                      index,
                    );

                    return (
                      <text
                        key={year}
                        x={point.x}
                        y={height - 12}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.38)"
                        fontSize="22"
                        fontWeight="700"
                      >
                        {year === 0
                          ? "Now"
                          : `${year}Y`}
                      </text>
                    );
                  },
                )}
              </svg>
            </div>
          </div>

          <div className="grid auto-rows-fr gap-3">
            <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                Conservative 5Y
              </p>

              <p className="mt-2 text-2xl font-black text-white/70">
                {money(
                  fiveYearConservative,
                )}
              </p>

              <p className="mt-2 text-xs text-white/30">
                {conservativeRate >= 0
                  ? "+"
                  : ""}
                {conservativeRate.toFixed(
                  1,
                )}
                % annual scenario
              </p>
            </div>

            <div className="rounded-[20px] border border-cyan-300/15 bg-cyan-300/[0.07] p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200/45">
                Base Case 5Y
              </p>

              <p className="mt-2 text-2xl font-black text-cyan-100">
                {money(fiveYearBase)}
              </p>

              <p className="mt-2 text-xs text-cyan-200/40">
                Estimated gain{" "}
                {money(fiveYearGain)}
              </p>
            </div>

            <div className="rounded-[20px] border border-violet-300/15 bg-violet-300/[0.07] p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-200/45">
                Optimistic 5Y
              </p>

              <p className="mt-2 text-2xl font-black text-violet-100">
                {money(
                  fiveYearOptimistic,
                )}
              </p>

              <p className="mt-2 text-xs text-violet-200/40">
                {optimisticRate >= 0
                  ? "+"
                  : ""}
                {optimisticRate.toFixed(1)}
                % annual scenario
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Gross Rental Yield",
              `${Number(
                grossRentYield ?? 0,
              ).toFixed(2)}%`,
            ],
            [
              "Monthly Cash Flow",
              `${money(
                monthlyCashFlow,
              )}/mo`,
            ],
            [
              "5Y Base Gain",
              money(fiveYearGain),
            ],
            [
              "AI Confidence",
              `${Math.round(
                Number(confidence ?? 0),
              )}%`,
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-[18px] border border-white/10 bg-black/20 p-4"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                {label}
              </p>

              <p className="mt-2 truncate text-sm font-bold text-white/72">
                {value}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] leading-5 text-white/24">
          Scenario projections are estimates,
          not guarantees. Future property values
          can differ materially due to market,
          financing, property-condition, and
          neighborhood changes.
        </p>
      </div>
    </section>
  );
}
