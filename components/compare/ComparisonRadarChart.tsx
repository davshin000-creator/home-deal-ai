"use client";

import { Badge, Card } from "@/components/ui";
import type { CompareProperty } from "@/types/comparison";

const dimensions = [
  {
    label: "Value",
    key: "brainScore",
    description: "Overall AI deal quality",
  },
  {
    label: "Risk",
    key: "riskScore",
    description: "Downside protection",
  },
  {
    label: "Rent",
    key: "rentalScore",
    description: "Rental income strength",
  },
  {
    label: "Offer",
    key: "negotiationScore",
    description: "Negotiation leverage",
  },
  {
    label: "Forecast",
    key: "forecastScore",
    description: "Future appreciation signal",
  },
  {
    label: "ROI",
    key: "roiScore",
    description: "Expected return profile",
  },
] as const;

const propertyStyles = [
  {
    bar: "bg-emerald-400",
    glow:
      "shadow-[0_0_16px_rgba(52,211,153,0.45)]",
    dot: "bg-emerald-400",
    text: "text-emerald-200",
  },
  {
    bar: "bg-indigo-400",
    glow:
      "shadow-[0_0_16px_rgba(129,140,248,0.45)]",
    dot: "bg-indigo-400",
    text: "text-indigo-200",
  },
  {
    bar: "bg-amber-400",
    glow:
      "shadow-[0_0_16px_rgba(251,191,36,0.4)]",
    dot: "bg-amber-400",
    text: "text-amber-200",
  },
];

export default function ComparisonRadarChart({
  properties,
}: {
  properties: CompareProperty[];
}) {
  return (
    <Card
      variant="premium"
      className="relative overflow-hidden p-6 md:p-8"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">
        <Badge variant="pro">Signal Profile</Badge>

        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
          Deal signal radar
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/45">
          See where each property leads across the core
          investment signals.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {properties.map((property, index) => {
            const style =
              propertyStyles[
                index % propertyStyles.length
              ];

            return (
              <div
                key={property.id}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
                />

                <span className="max-w-[190px] truncate text-xs font-medium text-white/60">
                  {property.address}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-7">
          {dimensions.map((dimension) => {
            const highest = Math.max(
              ...properties.map(
                (property) =>
                  property[dimension.key],
              ),
            );

            return (
              <div key={dimension.key}>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                      {dimension.label}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {dimension.description}
                    </p>
                  </div>

                  <p className="text-xs text-white/30">
                    Best: {highest}
                  </p>
                </div>

                <div className="grid gap-3">
                  {properties.map(
                    (property, index) => {
                      const score =
                        property[dimension.key];

                      const isBest =
                        score === highest;

                      const style =
                        propertyStyles[
                          index %
                            propertyStyles.length
                        ];

                      return (
                        <div
                          key={property.id}
                          className={`rounded-2xl border p-3 transition ${
                            isBest
                              ? "border-white/15 bg-white/[0.065]"
                              : "border-white/5 bg-white/[0.025]"
                          }`}
                        >
                          <div className="grid gap-2 md:grid-cols-[150px_1fr_48px] md:items-center">
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`}
                              />

                              <p className="truncate text-sm font-semibold text-white/60">
                                {property.address}
                              </p>
                            </div>

                            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${style.bar} ${style.glow}`}
                                style={{
                                  width: `${Math.max(
                                    0,
                                    Math.min(
                                      100,
                                      score,
                                    ),
                                  )}%`,
                                }}
                              />
                            </div>

                            <p
                              className={`text-right text-sm font-semibold ${
                                isBest
                                  ? style.text
                                  : "text-white"
                              }`}
                            >
                              {score}
                            </p>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}