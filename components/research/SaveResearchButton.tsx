"use client";

import {
  useState,
} from "react";

type Props = {
  reportType:
    | "deep"
    | "council"
    | "compare";

  symbolA?: string | null;
  symbolB?: string | null;

  result: unknown;
};

export default function SaveResearchButton({
  reportType,
  symbolA,
  symbolB,
  result,
}: Props) {
  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  async function saveResearch() {
    if (!symbolA || !result) {
      setMessage(
        "Research result is not ready.",
      );

      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/research/saved",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              report_type:
                reportType,

              symbol_a:
                symbolA,

              symbol_b:
                symbolB || null,

              result_json:
                result,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Could not save research.",
        );

        return;
      }

      setMessage(
        "Research saved.",
      );
    } catch (
      error
    ) {
      console.error(
        "save_research_failed",
        error,
      );

      setMessage(
        "Could not save research.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={
          saveResearch
        }
        disabled={
          saving
        }
        className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold text-white/70 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : "Save Research"}
      </button>

      {message && (
        <p className="text-xs text-white/35">
          {message}
        </p>
      )}
    </div>
  );
}
