import SiteFooter from "@/components/site/SiteFooter";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    body: "We may collect account information such as your name, email address, user ID, saved properties, analysis history, alert settings, usage counts, and information you enter into the platform such as addresses, listing prices, and search criteria.",
  },
  {
    number: "02",
    title: "Payment Information",
    body: "Payment information is processed by our payment provider. We do not store full credit card numbers on our servers.",
  },
  {
    number: "03",
    title: "How We Use Information",
    body: "We use information to operate Nestrova, provide property analysis, manage accounts, enforce usage limits, process subscriptions, send deal alerts, improve the product, and communicate with users.",
  },
  {
    number: "04",
    title: "Third-Party Services",
    body: "We may use third-party services for authentication, hosting, database storage, property data, email delivery, payments, analytics, and error monitoring. These providers process data according to their own policies and our service needs.",
  },
  {
    number: "05",
    title: "Data Retention",
    body: "We retain user data for as long as needed to provide the service, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion of your account data by contacting us.",
  },
  {
    number: "06",
    title: "Security",
    body: "We use reasonable technical and organizational safeguards to protect user data. However, no method of transmission or storage is 100% secure.",
  },
  {
    number: "07",
    title: "Your Choices",
    body: "You may access, update, or request deletion of certain personal information by contacting us. You may also unsubscribe from non-essential emails where applicable.",
  },
];

export default function PrivacyPage() {
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
              Legal · Privacy
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/50">
              How Nestrova collects, uses, protects, and manages information
              across the platform.
            </p>

            <p className="mt-7 text-xs font-medium uppercase tracking-[0.16em] text-white/25">
              Last updated · June 21, 2026
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-white/10 p-10 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/25">
              Policy
            </p>

            <p className="mt-4 text-sm leading-6 text-white/45">
              Your information and privacy matter. This policy explains the
              principles that govern data used by Nestrova.
            </p>
          </aside>

          <div className="divide-y divide-white/10">
            {sections.map((section) => (
              <section
                key={section.number}
                className="grid gap-5 px-7 py-9 sm:px-10 lg:grid-cols-[64px_1fr] lg:px-12"
              >
                <span className="text-xs font-semibold tracking-[0.18em] text-white/20">
                  {section.number}
                </span>

                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.025em] text-white">
                    {section.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                    {section.body}
                  </p>
                </div>
              </section>
            ))}

            <section className="grid gap-5 px-7 py-9 sm:px-10 lg:grid-cols-[64px_1fr] lg:px-12">
              <span className="text-xs font-semibold tracking-[0.18em] text-white/20">
                08
              </span>

              <div>
                <h2 className="text-xl font-semibold tracking-[-0.025em]">
                  Contact
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  Questions about this Privacy Policy can be sent to{" "}
                  <a
                    href="mailto:support@nestrovaai.com"
                    className="font-semibold text-white transition hover:text-white/65"
                  >
                    support@nestrovaai.com
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
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
