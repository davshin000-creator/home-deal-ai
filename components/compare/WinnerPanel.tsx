"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge, Card, Button } from "@/components/ui";
import type { CompareResult } from "@/types/comparison";

const reasonStyles = [
  {
    icon: "★",
    iconClass:
      "border-violet-300/20 bg-violet-500/20 text-violet-200",
  },
  {
    icon: "AI",
    iconClass:
      "border-blue-300/20 bg-blue-500/20 text-blue-200",
  },
  {
    icon: "↗",
    iconClass:
      "border-emerald-300/20 bg-emerald-500/20 text-emerald-200",
  },
  {
    icon: "$",
    iconClass:
      "border-amber-300/20 bg-amber-500/20 text-amber-200",
  },
];

export default function WinnerPanel({
  winner,
  result,
}: {
  winner: CompareResult["winner"];
  result: CompareResult;
}) {
  const router = useRouter();

  const [creatingReport, setCreatingReport] =
    useState(false);

  const [savingWinner, setSavingWinner] =
    useState(false);

  const [winnerSaved, setWinnerSaved] =
    useState(false);

  async function handleGenerateMemo() {
    try {
      setCreatingReport(true);

      const response = await fetch(
        "/api/reports/comparison",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            result,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not generate comparison memo."
        );
      }

      router.push(`/report/${data.report_id}`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unexpected error."
      );
    } finally {
      setCreatingReport(false);
    }
  }

  async function handleSaveWinner() {
    try {
      setSavingWinner(true);

      const response = await fetch(
        "/api/saved-properties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(winner.property),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not save winner."
        );
      }

      setWinnerSaved(true);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unexpected error."
      );
    } finally {
      setSavingWinner(false);
    }
  }

  return (
    <Card
      variant="premium"
      className="relative overflow-hidden p-6 md:p-8"
    >
      <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute bottom-[-180px] left-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        <Badge variant="buy">Winner</Badge>

        <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">
          {winner.property.address}
        </h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/62">
          Nestrova selected this property as the best overall
          deal with {winner.confidence}% confidence.
        </p>

        <div className="mt-7 grid gap-3">
          {winner.reasons.map((reason, index) => {
            const style =
              reasonStyles[index] ||
              reasonStyles[reasonStyles.length - 1];

            return (
              <div
                key={`${reason}-${index}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold shadow-lg ${style.iconClass}`}
                >
                  {style.icon}
                </div>

                <p className="text-sm font-medium leading-6 text-white/75 md:text-base">
                  {reason}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            variant="premium"
            onClick={handleGenerateMemo}
            disabled={creatingReport}
          >
            {creatingReport
              ? "Generating..."
              : "Generate Comparison Memo"}
          </Button>

          <Button
            variant="ghost"
            onClick={handleSaveWinner}
            disabled={savingWinner || winnerSaved}
            className="border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:text-white"
          >
            {savingWinner
              ? "Saving..."
              : winnerSaved
                ? "Winner Saved ✓"
                : "Save Winner"}
          </Button>
        </div>
      </div>
    </Card>
  );
}