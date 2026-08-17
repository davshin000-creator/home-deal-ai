import SiteFooter from "@/components/site/SiteFooter";

const policies = [
  {
    number: "01",
    title: "Subscription Refunds",
    body: "Nestrova Pro is a monthly subscription. If you are not satisfied, contact us within 7 days of your initial purchase and we will review your refund request.",
  },
  {
    number: "02",
    title: "Renewals",
    body: "Subscription renewals are generally non-refundable once a new billing period has started, unless required by applicable law or approved at our discretion.",
  },
  {
    number: "03",
    title: "Cancellation",
    body: "You may cancel your subscription at any time. After cancellation, you will retain access to paid features until the end of the current billing period.",
  },
  {
    number: "04",
    title: "Abuse and Excessive Use",
    body: "Refunds may be denied if there is evidence of abuse, fraud, violation of our Terms of Service, or unusually high usage of paid features during the refund period.",
  },
];

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-white sm:px-6 sm:py-12">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.045] sm:rounded-[40px]">
        <div className="border-b border-white/10 px-7 py-8 sm:px-10 sm:py-10 lg:px-14">
          <a
            href="/"
            className="text-sm font-semibold text-white/45 transition hover:text-white"
          >
            ← Back to Nestrova
          </a>

          <div className="mt-16 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
              Billing · Policy
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
              Refund Policy
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/50">
              Clear terms for subscription refunds, renewals, cancellations,
              and refund requests.
            </p>

            <p className="mt-7 text-xs font-medium uppercase tracking-[0.16em] text-white/25">
              Last updated · June 21, 2026
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {policies.map((policy) => (
            <section
              key={policy.number}
              className="grid gap-5 px-7 py-9 sm:px-10 lg:grid-cols-[90px_1fr] lg:px-14"
            >
              <span className="text-xs font-semibold tracking-[0.18em] text-white/20">
                {policy.number}
              </span>

              <div>
                <h2 className="text-xl font-semibold tracking-[-0.025em]">
                  {policy.title}
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/50">
                  {policy.body}
                </p>
              </div>
            </section>
          ))}

          <section className="px-7 py-10 sm:px-10 lg:px-14">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/30">
                05 · Refund Request
              </p>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                How to Request a Refund
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                To request a refund, email{" "}
                <a
                  href="mailto:support@nestrovaai.com"
                  className="font-semibold text-white transition hover:text-white/65"
                >
                  support@nestrovaai.com
                </a>{" "}
                with your account email, payment email, and reason for the
                request.
              </p>
            </div>
          </section>
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-5xl">
        <SiteFooter
          showProductLinks={false}
          className="rounded-[32px] border border-white/10 bg-white/[0.025] px-6"
        />
      </div>
    </main>
  );
}
