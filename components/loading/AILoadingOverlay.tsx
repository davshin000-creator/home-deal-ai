"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { icon: "🏠", label: "Reading property information..." },
  { icon: "📊", label: "Calculating AI fair value..." },
  { icon: "📈", label: "Estimating cash flow and yield..." },
  { icon: "🤖", label: "Building AI recommendation..." },
  { icon: "✨", label: "Finalizing your investment analysis..." },
];

const TIPS = [
  "Rental yield above 5% is often considered strong, but location and risk still matter.",
  "Deal Score combines valuation, rent potential, cash flow, and market quality.",
  "Use Portfolio to compare saved properties instead of judging one property alone.",
  "AI Reports are most useful when paired with due diligence from licensed professionals.",
  "Watchlist helps you track properties before making an offer.",
];

export default function AILoadingOverlay({
  title = "Nestrova AI is analyzing...",
  isVisible,
}: {
  title?: string;
  isVisible: boolean;
}) {
  const [progress, setProgress] = useState(8);
  const [stepIndex, setStepIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(8);
      setStepIndex(0);
      setTipIndex(0);
      return;
    }

    const progressTimer = setInterval(() => {
      setProgress((value) => (value >= 96 ? value : value + Math.floor(Math.random() * 7) + 3));
    }, 700);

    const stepTimer = setInterval(() => {
      setStepIndex((value) => Math.min(value + 1, STEPS.length - 1));
    }, 1500);

    const tipTimer = setInterval(() => {
      setTipIndex((value) => (value + 1) % TIPS.length);
    }, 2600);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearInterval(tipTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStep = STEPS[stepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-4xl">
            {currentStep.icon}
          </div>
          <h2 className="mt-5 text-3xl font-bold">{title}</h2>
          <p className="mt-3 text-lg font-semibold text-gray-700">{currentStep.label}</p>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex justify-between text-sm font-semibold text-gray-600">
            <span>Progress</span>
            <span>{Math.min(progress, 99)}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-4 rounded-full bg-black transition-all duration-500"
              style={{ width: `${Math.min(progress, 99)}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-gray-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">💡 AI Tip</p>
          <p className="mt-2 text-gray-700">{TIPS[tipIndex]}</p>
        </div>

        <div className="mt-8 grid gap-3">
          {STEPS.map((step, index) => (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-2xl border p-4 ${index <= stepIndex ? "bg-gray-50" : "bg-white opacity-60"}`}
            >
              <span className="text-xl">{index < stepIndex ? "✅" : step.icon}</span>
              <span className="font-semibold">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
