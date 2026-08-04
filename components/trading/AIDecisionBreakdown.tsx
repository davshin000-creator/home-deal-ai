"use client";

type DecisionComponent = {
  label: string;
  value: string;
  interpretation: string;
};

type AIDecisionBreakdownProps = {
  score: number;
  confidence: number;
  risk: string;
  regime: string;
  components: DecisionComponent[];
};

function parseComponentValue(value: string) {
  const parsed = Number.parseFloat(
    String(value)
      .replace("%", "")
      .replace("+", "")
      .trim(),
  );

  return Number.isFinite(parsed) ? parsed : 0;
}

function componentClasses(value: number) {
  if (value > 0) {
    return {
      text: "text-emerald-200",
      bar: "bg-emerald-300",
      badge:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    };
  }

  if (value < 0) {
    return {
      text: "text-orange-200",
      bar: "bg-orange-300",
      badge:
        "border-orange-400/20 bg-orange-400/10 text-orange-200",
    };
  }

  return {
    text: "text-white/55",
    bar: "bg-white/30",
    badge:
      "border-white/10 bg-white/[0.05] text-white/45",
  };
}

function riskClasses(risk: string) {
  switch (risk.trim().toUpperCase()) {
    case "LOW":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
    case "HIGH":
    case "CRITICAL":
      return "border-red-400/20 bg-red-400/10 text-red-200";
    default:
      return "border-amber-400/20 bg-amber-400/10 text-amber-100";
  }
}

function cleanLabel(value: string) {
  return String(value)
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AIDecisionBreakdown({
  score,
  confidence,
  risk,
  regime,
  components,
}: AIDecisionBreakdownProps) {
  const normalizedComponents = components.map(
    (component) => ({
      ...component,
      numericValue: parseComponentValue(
        component.value,
      ),
    }),
  );

  const maximumMagnitude = Math.max(
    1,
    ...normalizedComponents.map((component) =>
      Math.abs(component.numericValue),
    ),
  );

  return (
    <section className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.035] p-6 md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300/75">
            AI Decision Breakdown
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em]">
            How Nestrova formed this score.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
            Each component shows how public market research contributed
            to the current opportunity score.
          </p>
        </div>

        <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/[0.08] px-6 py-5 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-100/55">
            Overall AI Score
          </p>

          <p className="mt-2 text-5xl font-black tracking-[-0.06em] text-cyan-100">
            {score}
          </p>

          <p className="mt-1 text-xs text-white/30">
            Out of 100
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_380px]">
        <div className="space-y-4">
          {normalizedComponents.length > 0 ? (
            normalizedComponents.map((component) => {
              const classes = componentClasses(
                component.numericValue,
              );

              const width = Math.max(
                4,
                Math.min(
                  100,
                  (Math.abs(component.numericValue) /
                    maximumMagnitude) *
                    100,
                ),
              );

              return (
                <article
                  key={component.label}
                  className="rounded-[22px] border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-semibold text-white/75">
                        {cleanLabel(component.label)}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/38">
                        {component.interpretation}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-sm font-bold ${classes.badge}`}
                    >
                      {component.numericValue > 0 ? "+" : ""}
                      {component.numericValue}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${classes.bar}`}
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-6">
              <p className="font-semibold text-white/65">
                Component details are not available.
              </p>

              <p className="mt-2 text-sm leading-6 text-white/35">
                The overall score remains available, but the current
                public research source did not provide component-level
                attribution.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
              Confidence
            </p>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-4xl font-black tracking-[-0.05em]">
                {confidence}%
              </p>

              <p className="text-xs text-white/30">
                Signal conviction
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-300"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, confidence),
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
              Current Risk
            </p>

            <span
              className={`mt-4 inline-flex rounded-full border px-4 py-2 text-sm font-bold ${riskClasses(
                risk,
              )}`}
            >
              {cleanLabel(risk)}
            </span>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
              Market Regime
            </p>

            <p className="mt-4 text-xl font-bold text-white/75">
              {cleanLabel(regime)}
            </p>
          </div>

          <div className="rounded-[24px] border border-violet-300/15 bg-violet-300/[0.06] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100/55">
              Interpretation
            </p>

            <p className="mt-3 text-sm leading-7 text-white/45">
              Positive values increase the opportunity score. Negative
              values reduce conviction because of risk, volatility, or
              weaker market structure.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
