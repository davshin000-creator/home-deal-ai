"use client";

import { Card, Badge } from "@/components/ui";
import type { CompareProperty } from "@/types/comparison";

const dimensions = [
  ["Value", "brainScore"],
  ["Risk", "riskScore"],
  ["Rent", "rentalScore"],
  ["Offer", "negotiationScore"],
  ["Forecast", "forecastScore"],
  ["ROI", "roiScore"],
] as const;

export default function ComparisonRadarChart({ properties }: { properties: CompareProperty[] }) {
  return (
    <Card variant="premium" className="p-8">
      <Badge variant="pro">Radar</Badge>
      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">Deal signal radar</h2>
      <div className="mt-8 grid gap-5">
        {dimensions.map(([label,key])=>(
          <div key={key}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">{label}</p>
            <div className="grid gap-3">
              {properties.map((p)=>(
                <div key={p.id} className="grid gap-2 md:grid-cols-[160px_1fr_52px] md:items-center">
                  <p className="text-sm font-semibold text-white/60">{p.address}</p>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.55)]" style={{ width: `${p[key]}%` }} />
                  </div>
                  <p className="text-right text-sm font-semibold text-white">{p[key]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

