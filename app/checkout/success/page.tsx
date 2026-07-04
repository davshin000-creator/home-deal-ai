import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <section className="mx-auto max-w-3xl rounded-[40px] border border-white/10 bg-white/[0.07] p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Payment Successful</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Welcome to Nestrova Pro.</h1>
        <p className="mt-5 text-lg leading-8 text-white/55">
          Pro access is active in this browser for testing. Next step is saving Pro status in your database.
        </p>
        <Link href="/brain-console" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
          Open Brain Console
        </Link>
      </section>
    </main>
  );
}
