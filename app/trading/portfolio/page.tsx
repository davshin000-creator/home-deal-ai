import Link from "next/link";
import PortfolioAI from "@/components/trading/PortfolioAI";

export const dynamic = "force-dynamic";

export default function TradingPortfolioPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-8 md:py-14">
        <Link
          href="/trading"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to Trading
        </Link>

        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300/70">
            My AI Portfolio
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] md:text-6xl">
            Portfolio Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/45">
            Review public AI research for assets in your watchlist.
            No brokerage balances, positions, orders, or execution
            information are included.
          </p>
        </div>

        <div className="mt-10">
          <PortfolioAI />
        </div>
      </section>
    </main>
  );
}
