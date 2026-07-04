import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <section className="mx-auto max-w-3xl rounded-[40px] border border-white/10 bg-white/[0.07] p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Checkout Cancelled</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Payment was not completed.</h1>
        <p className="mt-5 text-lg leading-8 text-white/55">You can return to pricing and try again anytime.</p>
        <Link href="/pricing" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
          Back to Pricing
        </Link>
      </section>
    </main>
  );
}
