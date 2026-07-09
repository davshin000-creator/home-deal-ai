import PortfolioEmpty from "@/components/empty/PortfolioEmpty";
import ReportEmpty from "@/components/empty/ReportEmpty";
import CoachEmpty from "@/components/empty/CoachEmpty";
import WatchlistEmpty from "@/components/empty/WatchlistEmpty";
import CompareEmpty from "@/components/empty/CompareEmpty";
import MarketsEmpty from "@/components/empty/MarketsEmpty";
import WeeklyReportEmpty from "@/components/empty/WeeklyReportEmpty";
import DealFinderEmpty from "@/components/empty/DealFinderEmpty";

export default function EmptyPreviewPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto grid max-w-6xl gap-8">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
          Back to Nestrova
        </a>
        <section className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-5xl font-bold">Empty States Preview</h1>
          <p className="mt-3 text-gray-600">Reusable empty state components for launch-quality first-use experiences.</p>
        </section>
        <PortfolioEmpty />
        <ReportEmpty />
        <CoachEmpty />
        <WatchlistEmpty />
        <CompareEmpty />
        <MarketsEmpty />
        <WeeklyReportEmpty />
        <DealFinderEmpty />
      </div>
    </main>
  );
}


