import PayPalCheckoutButton from "@/components/payments/PayPalCheckoutButton";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <section className="mx-auto grid max-w-5xl gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">Pricing</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Unlock Nestrova Pro.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">
            Unlimited AI analysis, Brain Console, deal comparison, and investment memo tools.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_420px]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.06] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/35">Nestrova Pro</p>
            <div className="mt-4 flex items-end gap-2">
              <p className="text-6xl font-semibold tracking-[-0.06em]">$19</p>
              <p className="pb-2 text-white/45">/ month</p>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-white/65">
              <p>✓ Unlimited AI property analysis</p>
              <p>✓ Nestrova Brain Console</p>
              <p>✓ AI Deal Comparison</p>
              <p>✓ Investment Memo access</p>
              <p>✓ Future AI agent features</p>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.08] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/35">Checkout</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Pay securely with PayPal</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">Sandbox first. After testing, switch to Live.</p>
            <div className="mt-6"><PayPalCheckoutButton /></div>
          </div>
        </div>
      </section>
    </main>
  );
}
