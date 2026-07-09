import NegotiationEngine from "@/components/negotiation/NegotiationEngine";

export default function NegotiationPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">Back to Nestrova</a>
        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">RC3-B Negotiation Engine</p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">Turn an offer price into a negotiation strategy.</h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">Generate seller motivation, counter offer suggestions, talking points, concessions, inspection focus, risk summary, and an agent email draft.</p>
        </section>
        <div className="mt-8"><NegotiationEngine /></div>
      </div>
    </main>
  );
}


