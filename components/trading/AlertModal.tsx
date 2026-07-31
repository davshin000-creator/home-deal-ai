"use client";

import { useEffect, useState } from "react";

type AlertModalProps = {
  isOpen: boolean;
  symbol: string;
  assetType: string;
  currentScore: number;
  currentRisk: string;
  onClose: () => void;
  onSaved?: () => void;
};

type AlertCondition =
  | "opportunity_score"
  | "risk_change"
  | "regime_change"
  | "buy_signal";

export default function AlertModal({
  isOpen,
  symbol,
  assetType,
  currentScore,
  currentRisk,
  onClose,
  onSaved,
}: AlertModalProps) {
  const [condition, setCondition] =
    useState<AlertCondition>("opportunity_score");
  const [scoreThreshold, setScoreThreshold] = useState(
    Math.max(80, currentScore),
  );
  const [riskThreshold, setRiskThreshold] = useState(
    currentRisk.toUpperCase() || "LOW",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setCondition("opportunity_score");
    setScoreThreshold(Math.max(80, currentScore));
    setRiskThreshold(currentRisk.toUpperCase() || "LOW");
    setErrorMessage(null);
  }, [currentRisk, currentScore, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  async function handleSave() {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/trading/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        symbol,
        asset_type: assetType.toLowerCase(),
        condition_type: condition,
        opportunity_threshold:
            condition === "opportunity_score"
            ? scoreThreshold
            : null,
        risk_threshold:
            condition === "risk_change"
            ? riskThreshold
            : null,
        is_active: true,
        }),
      });

      const data = (await response.json()) as {
  success?: boolean;
  code?: string;
  error?: string;
};

if (
  response.status === 403 &&
  data.code === "TRADING_SUBSCRIPTION_REQUIRED"
) {
  throw new Error(
    "Trading Pro or Nestrova AI Pro is required to create this alert.",
  );
}

if (!response.ok || !data.success) {
  throw new Error(
    data.error ?? "Unable to save this alert.",
  );
}

      onSaved?.();
      onClose();
    } catch (error) {
      console.error("Alert save error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save this alert.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-100/60">
              Nestrova Alert
            </p>

            <h2
              id="alert-modal-title"
              className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white"
            >
              Create an alert for {symbol}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Nestrova will notify you when the selected market condition
              is detected.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/50 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close alert modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <label
              htmlFor="alert-condition"
              className="text-xs font-bold uppercase tracking-[0.14em] text-white/35"
            >
              Alert condition
            </label>

            <select
              id="alert-condition"
              value={condition}
              onChange={(event) =>
                setCondition(event.target.value as AlertCondition)
              }
              className="mt-3 h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm font-semibold text-white outline-none transition focus:border-amber-300/40"
            >
              <option value="opportunity_score">
                Opportunity Score reaches threshold
              </option>

              <option value="risk_change">
                Risk changes to selected level
              </option>

              <option value="regime_change">
                Market regime changes
              </option>

              <option value="buy_signal">
                New AI research signal appears
              </option>
            </select>
          </div>

          {condition === "opportunity_score" ? (
            <div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="score-threshold"
                  className="text-xs font-bold uppercase tracking-[0.14em] text-white/35"
                >
                  Score threshold
                </label>

                <span className="text-xl font-black text-amber-100">
                  {scoreThreshold}
                </span>
              </div>

              <input
                id="score-threshold"
                type="range"
                min={1}
                max={100}
                value={scoreThreshold}
                onChange={(event) =>
                  setScoreThreshold(Number(event.target.value))
                }
                className="mt-4 w-full accent-amber-300"
              />

              <div className="mt-2 flex justify-between text-xs text-white/25">
                <span>1</span>
                <span>100</span>
              </div>
            </div>
          ) : null}

          {condition === "risk_change" ? (
            <div>
              <label
                htmlFor="risk-threshold"
                className="text-xs font-bold uppercase tracking-[0.14em] text-white/35"
              >
                Notify when risk becomes
              </label>

              <select
                id="risk-threshold"
                value={riskThreshold}
                onChange={(event) =>
                  setRiskThreshold(event.target.value)
                }
                className="mt-3 h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm font-semibold text-white outline-none transition focus:border-amber-300/40"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
          ) : null}

          {condition === "regime_change" ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-sm leading-6 text-white/55">
                You will be notified whenever Nestrova detects a new
                market regime for {symbol}.
              </p>
            </div>
          ) : null}

          {condition === "buy_signal" ? (
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
              <p className="text-sm leading-6 text-emerald-100/70">
                You will be notified when a new AI research signal
                is detected for {symbol}.
              </p>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-5 text-sm font-bold text-white/65 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex h-11 min-w-[130px] items-center justify-center rounded-xl border border-amber-300/25 bg-amber-300/10 px-5 text-sm font-bold text-amber-100 transition hover:border-amber-300/40 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Create Alert"}
          </button>
        </div>
      </div>
    </div>
  );
}