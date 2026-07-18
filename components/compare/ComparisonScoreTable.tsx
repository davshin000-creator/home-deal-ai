"use client";

import { Badge, Card } from "@/components/ui";
import type { CompareProperty } from "@/types/comparison";

const rows = [
  {
    label: "AI Brain",
    key: "brainScore",
    description: "Overall decision quality",
  },
  {
    label: "Risk",
    key: "riskScore",
    description: "Market & downside profile",
  },
  {
    label: "Rental",
    key: "rentalScore",
    description: "Rental strength",
  },
  {
    label: "Negotiation",
    key: "negotiationScore",
    description: "Offer leverage",
  },
  {
    label: "Forecast",
    key: "forecastScore",
    description: "Future appreciation",
  },
  {
    label: "Cash Flow",
    key: "cashflowScore",
    description: "Monthly performance",
  },
  {
    label: "ROI",
    key: "roiScore",
    description: "Investment return",
  },
] as const;

export default function ComparisonScoreTable({
  properties,
}: {
  properties: CompareProperty[];
}) {
  return (
    <Card
      variant="premium"
      className="overflow-hidden p-0"
    >
      <div className="border-b border-white/10 bg-white/[0.03] p-6">
        <Badge variant="pro">Score Breakdown</Badge>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
          Side-by-side AI intelligence
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Compare every major investment signal used by
          Nestrova AI.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                Signal
              </th>

              {properties.map((property) => (
                <th
                  key={property.id}
                  className="px-6 py-4 text-left"
                >
                  <div className="text-sm font-semibold text-white">
                    {property.address}
                  </div>

                  <div className="mt-1 text-xs text-white/35">
                    {property.city}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const highest = Math.max(
                ...properties.map(
                  (property) => property[row.key],
                ),
              );

              return (
                <tr
                  key={row.key}
                  className="border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-5">
                    <div className="font-semibold text-white">
                      {row.label}
                    </div>

                    <div className="mt-1 text-xs text-white/35">
                      {row.description}
                    </div>
                  </td>

                  {properties.map((property) => {
                    const score = property[row.key];
                    const winner =
                      score === highest;

                    return (
                      <td
                        key={property.id}
                        className="px-6 py-5"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-lg font-semibold ${
                                winner
                                  ? "text-emerald-300"
                                  : "text-white"
                              }`}
                            >
                              {score}
                            </span>

                            {winner && (
                              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                                Best
                              </span>
                            )}
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full transition-all ${
                                winner
                                  ? "bg-emerald-400"
                                  : "bg-indigo-400"
                              }`}
                              style={{
                                width: `${score}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}