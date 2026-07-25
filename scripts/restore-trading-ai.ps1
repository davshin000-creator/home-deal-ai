$path = "components\trading\TradingAI.tsx"

New-Item -ItemType Directory -Force -Path (Split-Path $path) | Out-Null

@"
"use client";

type Props = {
  market?: any;
  council?: any;
  opportunities?: any;
  system?: any;
};

export default function TradingAI({
  market,
  council,
  opportunities,
  system,
}: Props) {
  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-2">
        <h2 className="text-2xl font-bold">
          Trading AI
        </h2>
        <p className="text-sm text-gray-500">
          AI-powered market analysis and strategy assistant.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">
            Market Overview
          </h3>

          <pre className="text-xs overflow-auto">
{JSON.stringify(market, null, 2)}
          </pre>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">
            Executive Council
          </h3>

          <pre className="text-xs overflow-auto">
{JSON.stringify(council, null, 2)}
          </pre>
        </div>

      </div>

      <div className="mt-4 rounded-xl border p-4">
        <h3 className="font-semibold mb-2">
          Opportunities
        </h3>

        <pre className="text-xs overflow-auto">
{JSON.stringify(opportunities, null, 2)}
        </pre>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <h3 className="font-semibold mb-2">
          System Status
        </h3>

        <pre className="text-xs overflow-auto">
{JSON.stringify(system, null, 2)}
        </pre>
      </div>

    </section>
  );
}
"@ | Set-Content $path -Encoding utf8

Write-Host ""
Write-Host "TradingAI restored successfully." -ForegroundColor Green
