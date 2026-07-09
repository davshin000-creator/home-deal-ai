import OfferGenerator from "@/components/offer/OfferGenerator";

export default function OfferPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">Back to Nestrova</a>
        <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">RC3-A Offer Engine</p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">Generate smarter real estate offer strategies.</h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">Estimate a recommended offer, offer strength, AI confidence, negotiation leverage, and key reasons behind the strategy.</p>
        </section>
        <div className="mt-8"><OfferGenerator /></div>
      </div>
    </main>
  );
}


