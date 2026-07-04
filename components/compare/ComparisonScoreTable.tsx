"use client";

import { Card, Badge } from "@/components/ui";
import type { CompareProperty } from "@/types/comparison";

const rows = [
  ["Brain", "brainScore"],
  ["Risk", "riskScore"],
  ["Rental", "rentalScore"],
  ["Negotiation", "negotiationScore"],
  ["Forecast", "forecastScore"],
  ["Cashflow", "cashflowScore"],
  ["ROI", "roiScore"],
] as const;

export default function ComparisonScoreTable({ properties }: { properties: CompareProperty[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-black/10 p-6">
        <Badge variant="pro">Score Table</Badge>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-neutral-950">Side-by-side intelligence</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
            <tr><th className="p-4">Signal</th>{properties.map((p)=><th key={p.id} className="p-4">{p.address}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(([label,key])=>(
              <tr key={key} className="border-t border-black/10">
                <td className="p-4 font-semibold text-neutral-950">{label}</td>
                {properties.map((p)=><td key={p.id} className="p-4 text-neutral-700">{p[key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
