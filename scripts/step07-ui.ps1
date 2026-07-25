. "$PSScriptRoot\devtools.ps1"

$assetHeader = @"
type AssetHeaderProps = {
  symbol: string;
  recommendation: string;
  risk: string;
};

export default function AssetHeader({
  symbol,
  recommendation,
  risk,
}: AssetHeaderProps) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Nestrova Asset Intelligence
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {symbol}
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            AI-generated market outlook, risk assessment, price targets, and
            executive council analysis.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {recommendation}
          </span>

          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Risk: {risk}
          </span>
        </div>
      </div>
    </header>
  );
}
"@

$aiScoreCard = @"
type AIScoreCardProps = {
  score: number;
  bullProbability: number;
  recommendation: string;
};

export default function AIScoreCard({
  score,
  bullProbability,
  recommendation,
}: AIScoreCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
        AI Conviction
      </p>

      <div className="mt-5 flex items-end gap-2">
        <span className="text-6xl font-bold tracking-tight text-slate-950">
          {score}
        </span>
        <span className="pb-2 text-xl font-semibold text-slate-400">/100</span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-slate-600">Bull probability</span>
          <span className="font-bold text-slate-950">
            {bullProbability}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900"
            style={{ width: bullProbability + "%" }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recommendation
        </p>
        <p className="mt-1 text-xl font-bold text-slate-950">
          {recommendation}
        </p>
      </div>
    </section>
  );
}
"@

$executiveCouncilCard = @"
export type CouncilMember = {
  name: string;
  signal: string;
};

type ExecutiveCouncilCardProps = {
  council: CouncilMember[];
};

function signalClass(signal: string) {
  const normalized = signal.toLowerCase();

  if (normalized.includes("bull")) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (normalized.includes("bear")) {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function ExecutiveCouncilCard({
  council,
}: ExecutiveCouncilCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Executive Council
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Multi-agent consensus
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        {council.map((member) => (
          <div
            key={member.name}
            className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
          >
            <span className="font-semibold text-slate-800">
              {member.name}
            </span>

            <span
              className={
                "rounded-full px-3 py-1 text-sm font-semibold " +
                signalClass(member.signal)
              }
            >
              {member.signal}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
"@

$priceTargetCard = @"
type PriceTargets = {
  bull: number;
  base: number;
  bear: number;
};

type PriceTargetCardProps = {
  targets: PriceTargets;
};

function formatTarget(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PriceTargetCard({
  targets,
}: PriceTargetCardProps) {
  const items = [
    {
      label: "Bull case",
      value: targets.bull,
      className: "bg-emerald-50 text-emerald-800",
    },
    {
      label: "Base case",
      value: targets.base,
      className: "bg-blue-50 text-blue-800",
    },
    {
      label: "Bear case",
      value: targets.bear,
      className: "bg-red-50 text-red-800",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
        Price Targets
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-950">
        Scenario valuation
      </h2>

      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={"rounded-2xl p-4 " + item.className}
          >
            <p className="text-sm font-semibold opacity-80">{item.label}</p>
            <p className="mt-1 text-2xl font-bold">
              {formatTarget(item.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
"@

$assetPage = @"
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AIScoreCard from "@/components/trading/AIScoreCard";
import AssetHeader from "@/components/trading/AssetHeader";
import ExecutiveCouncilCard, {
  type CouncilMember,
} from "@/components/trading/ExecutiveCouncilCard";
import PriceTargetCard from "@/components/trading/PriceTargetCard";

type AssetAnalysis = {
  symbol: string;
  aiScore: number;
  recommendation: string;
  bullProbability: number;
  risk: string;
  priceTargets: {
    bull: number;
    base: number;
    bear: number;
  };
  council: CouncilMember[];
  reasons: string[];
};

export default function AssetDetailPage() {
  const params = useParams<{ symbol: string }>();

  const symbol = useMemo(() => {
    const rawSymbol = params?.symbol ?? "NVDA";
    return decodeURIComponent(rawSymbol).toUpperCase();
  }, [params]);

  const [analysis, setAnalysis] = useState<AssetAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAsset() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          "/api/trading/asset?symbol=" + encodeURIComponent(symbol),
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Asset analysis request failed.");
        }

        const data = (await response.json()) as AssetAnalysis;
        setAnalysis(data);
      } catch (requestError) {
        if (
          requestError instanceof Error &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load asset analysis."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadAsset();

    return () => controller.abort();
  }, [symbol]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8">
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="mt-5 h-12 w-56 rounded bg-slate-200" />
            <div className="mt-5 h-5 max-w-xl rounded bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-slate-950">
            Asset analysis unavailable
          </h1>
          <p className="mt-3 text-red-700">
            {error || "No analysis was returned."}
          </p>

          <Link
            href="/trading"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
          >
            Return to Trading
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/trading"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            ก็ Back to Trading
          </Link>
        </div>

        <AssetHeader
          symbol={analysis.symbol}
          recommendation={analysis.recommendation}
          risk={analysis.risk}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <AIScoreCard
            score={analysis.aiScore}
            bullProbability={analysis.bullProbability}
            recommendation={analysis.recommendation}
          />

          <ExecutiveCouncilCard council={analysis.council} />

          <PriceTargetCard targets={analysis.priceTargets} />
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Key Reasons
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Why the AI reached this conclusion
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {analysis.reasons.map((reason, index) => (
              <div
                key={reason}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <span className="text-xs font-bold text-slate-400">
                  0{index + 1}
                </span>
                <p className="mt-2 font-semibold text-slate-800">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-3 rounded-3xl bg-slate-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-bold">Track this opportunity</h2>
            <p className="mt-2 text-slate-300">
              Watchlist and alert persistence will be connected in the next
              steps.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Add to Watchlist
            </button>

            <button
              type="button"
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-900"
            >
              Create Alert
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
"@

Write-CodeFile "components\trading\AssetHeader.tsx" $assetHeader
Write-CodeFile "components\trading\AIScoreCard.tsx" $aiScoreCard
Write-CodeFile "components\trading\ExecutiveCouncilCard.tsx" $executiveCouncilCard
Write-CodeFile "components\trading\PriceTargetCard.tsx" $priceTargetCard
Write-CodeFile "app\trading\asset\[symbol]\page.tsx" $assetPage

$requiredFiles = @(
  "components\trading\AssetHeader.tsx",
  "components\trading\AIScoreCard.tsx",
  "components\trading\ExecutiveCouncilCard.tsx",
  "components\trading\PriceTargetCard.tsx",
  "app\trading\asset\[symbol]\page.tsx",
  "app\api\trading\asset\route.ts"
)

Write-Host ""
Write-Host "Verifying Step 7 files..." -ForegroundColor Cyan

$hasErrors = $false

foreach ($file in $requiredFiles) {
  if (!(Test-Path -LiteralPath $file)) {
    Write-Host "MISSING: $file" -ForegroundColor Red
    $hasErrors = $true
    continue
  }

  $length = (Get-Item -LiteralPath $file).Length

  if ($length -le 0) {
    Write-Host "EMPTY: $file" -ForegroundColor Red
    $hasErrors = $true
  }
  else {
    Write-Host "OK: $file ($length bytes)" -ForegroundColor Green
  }
}

if ($hasErrors) {
  Write-Host ""
  Write-Host "Step 7 verification failed. Build was not started." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Clearing Next.js cache..." -ForegroundColor Cyan
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Running production build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Build failed." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "STEP 7 ASSET DETAIL PAGE COMPLETED." -ForegroundColor Green
Write-Host "Test URL: http://localhost:3000/trading/asset/NVDA" -ForegroundColor Cyan

