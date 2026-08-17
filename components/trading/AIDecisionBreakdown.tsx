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
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(
    normalized
      .replace("%", "")
      .replace("+", "")
      .trim(),
  );

  return Number.isFinite(parsed) ? parsed : null;
}

function cleanLabel(value: string) {
  return String(value)
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function factorSignal(value: number | null) {
  if (value === null) {
    return {
      label: "No Signal",
      description:
        "There is not enough public data to rate this factor.",
      badge:
        "border-white/10 bg-white/[0.05] text-white/45",
      dot: "bg-white/30",
      bar: "bg-white/25",
    };
  }

  if (value >= 15) {
    return {
      label: "Strong Positive",
      description:
        "This factor is strongly supporting the current bullish outlook.",
      badge:
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
      dot: "bg-emerald-300",
      bar: "bg-emerald-300",
    };
  }

  if (value >= 8) {
    return {
      label: "Positive",
      description:
        "This factor is supporting the current outlook.",
      badge:
        "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200",
      dot: "bg-emerald-300",
      bar: "bg-emerald-300",
    };
  }

  if (value > 0) {
    return {
      label: "Constructive",
      description:
        "This factor is mildly supportive, but not a major driver.",
      badge:
        "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-100",
      dot: "bg-cyan-300",
      bar: "bg-cyan-300",
    };
  }

  if (value <= -8) {
    return {
      label: "Negative",
      description:
        "This factor is meaningfully weakening the current outlook.",
      badge:
        "border-red-400/20 bg-red-400/[0.08] text-red-200",
      dot: "bg-red-300",
      bar: "bg-red-300",
    };
  }

  if (value < 0) {
    return {
      label: "Weak",
      description:
        "This factor is slightly working against the current outlook.",
      badge:
        "border-orange-400/20 bg-orange-400/[0.08] text-orange-200",
      dot: "bg-orange-300",
      bar: "bg-orange-300",
    };
  }

  return {
    label: "Neutral",
    description:
      "This factor is not materially changing the current outlook.",
    badge:
      "border-white/10 bg-white/[0.05] text-white/55",
    dot: "bg-white/35",
    bar: "bg-white/30",
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

function confidenceLabel(confidence: number) {
  if (confidence >= 85) {
    return "High confidence";
  }

  if (confidence >= 70) {
    return "Good confidence";
  }

  if (confidence >= 55) {
    return "Moderate confidence";
  }

  return "Low confidence";
}

export default function AIDecisionBreakdown({
  score,
  confidence,
  risk,
  regime,
  components,
}: AIDecisionBreakdownProps) {
  const normalizedComponents = components.map(
    (component) => {
      const numericValue = parseComponentValue(
        component.value,
      );

      return {
        ...component,
        numericValue,
        signal: factorSignal(numericValue),
      };
    },
  );

  const maximumMagnitude = Math.max(
    1,
    ...normalizedComponents.map((component) =>
      Math.abs(component.numericValue ?? 0),
    ),
  );

  return (
    <section className="mt-8 rounded-[32px] border border-white/10 bg-white/[0.035] p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300/75">
            Why Nestrova Thinks This
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] md:text-4xl">
            What is driving the AI outlook?
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/42">
            We turn the technical analysis into
            plain-language signals so you can quickly
            see what supports — or weakens — the
            current outlook.
          </p>
        </div>

        <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/[0.08] px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-100/55">
            Overall AI Score
          </p>

          <div className="mt-2 flex items-end gap-2">
            <p className="text-5xl font-black tracking-[-0.06em] text-cyan-100">
              {score}
            </p>

            <p className="pb-1 text-sm font-semibold text-white/30">
              / 100
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <div className="space-y-3">
          {normalizedComponents.length > 0 ? (
            normalizedComponents.map((component) => {
              const {
                numericValue,
                signal,
              } = component;

              const width =
                numericValue === null
                  ? 0
                  : Math.max(
                      5,
                      Math.min(
                        100,
                        (Math.abs(numericValue) /
                          maximumMagnitude) *
                          100,
                      ),
                    );

              return (
                <article
                  key={component.label}
                  className="rounded-[22px] border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${signal.dot}`}
                        />

                        <p className="text-base font-bold text-white/80">
                          {cleanLabel(
                            component.label,
                          )}
                        </p>
                      </div>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/42">
                        {component.interpretation ||
                          signal.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${signal.badge}`}
                      >
                        {signal.label}
                      </span>

                      {numericValue !== null ? (
                        <p className="mt-2 text-[10px] text-white/20">
                          Model contribution{" "}
                          {numericValue > 0
                            ? "+"
                            : ""}
                          {numericValue}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {numericValue !== null ? (
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full ${signal.bar}`}
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  ) : null}
                </article>
              );
            })
          ) : (
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-6">
              <p className="font-semibold text-white/65">
                Detailed factor analysis is not
                available yet.
              </p>

              <p className="mt-2 text-sm leading-6 text-white/35">
                The overall AI outlook and confidence
                remain available.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-cyan-300/15 bg-cyan-300/[0.055] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100/50">
              AI Confidence
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-4xl font-black tracking-[-0.05em] text-cyan-100">
                {confidence}%
              </p>

              <p className="pb-1 text-xs font-semibold text-white/35">
                {confidenceLabel(confidence)}
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-300"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      confidence,
                    ),
                  )}%`,
                }}
              />
            </div>

            <p className="mt-4 text-xs leading-5 text-white/30">
              Higher confidence means more of the
              model&apos;s signals currently agree.
              It does not guarantee the future move.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
                Risk
              </p>

              <span
                className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${riskClasses(
                  risk,
                )}`}
              >
                {cleanLabel(risk)}
              </span>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
                Market
              </p>

              <p className="mt-4 text-sm font-bold leading-5 text-white/70">
                {cleanLabel(regime)}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-violet-300/15 bg-violet-300/[0.06] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100/55">
              Quick Guide
            </p>

            <div className="mt-4 space-y-3 text-sm text-white/42">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                <span>
                  Positive = supports the outlook
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-white/35" />
                <span>
                  Neutral = little current impact
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-orange-300" />
                <span>
                  Weak / Negative = works against it
                </span>
              </div>
            </div>
          </div>

          <p className="px-1 text-[10px] leading-5 text-white/20">
            Nestrova provides research and
            decision-support information, not
            personalized investment advice or
            guaranteed outcomes.
          </p>
        </aside>
      </div>
    </section>
  );
}
