export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl rounded-[40px] border border-white/10 bg-white/[0.07] p-8">
        <a href="/" className="text-sm font-semibold text-white/50 hover:text-white">
          Back to Nestrova
        </a>

        <h1 className="mt-8 text-5xl font-semibold tracking-[-0.06em]">
          Terms of Service
        </h1>

        <p className="mt-5 text-white/55">
          Nestrova is an AI decision-support tool for real estate research. It is not financial, legal, tax, lending, or investment advice.
        </p>

        <div className="mt-8 grid gap-5 text-sm leading-7 text-white/55">
          <p>Users are responsible for verifying all property data, market data, financing assumptions, and investment decisions.</p>
          <p>AI outputs may be incomplete or inaccurate and should be reviewed with qualified professionals before any transaction.</p>
          <p>Use of Nestrova is provided as-is without guarantees of investment performance or accuracy.</p>
          <p>By using Nestrova, you agree not to rely solely on the platform for purchasing, selling, financing, or investing decisions.</p>
        </div>
      </section>
    </main>
  );
}
