"use client";

import { useState } from "react";
import AILoadingOverlay from "@/components/loading/AILoadingOverlay";
import AnalysisSkeleton from "@/components/loading/AnalysisSkeleton";
import ScoreCounter from "@/components/loading/ScoreCounter";

export default function LoadingPreviewPage() {
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function runDemo() {
    setLoading(true);
    setShowResult(false);

    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 6500);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <AILoadingOverlay isVisible={loading} />

      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
          ??Back to Nestrova
        </a>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow">
          <h1 className="text-5xl font-bold">AI Loading Experience</h1>
          <p className="mt-3 text-gray-600">
            Launch-quality loading overlay, progress steps, AI tips, skeleton UI,
            and animated score counters.
          </p>

          <button
            onClick={runDemo}
            className="mt-6 rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
          >
            Run Loading Demo
          </button>
        </section>

        <section className="mt-8">
          {loading && <AnalysisSkeleton />}

          {showResult && (
            <div className="rounded-3xl border-2 border-black bg-white p-8 shadow">
              <p className="text-sm font-semibold text-gray-500">ANALYSIS COMPLETE</p>
              <h2 className="mt-2 text-4xl font-bold">
                Deal Score: <ScoreCounter score={92} />
              </h2>
              <p className="mt-4 text-gray-600">
                Nestrova AI completed the analysis and generated an investment recommendation.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

