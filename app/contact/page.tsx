import SiteFooter from "@/components/site/SiteFooter";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <a
          href="/"
          className="text-sm font-semibold text-gray-600 hover:text-black"
        >
          ← Back to Nestrova
        </a>

        <h1 className="mt-6 text-4xl font-bold">
          Contact & Support
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Last updated: July 2026
        </p>

        <div className="mt-8 space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Customer Support
            </h2>

            <p className="mt-3">
              If you have any questions regarding your account,
              subscription, billing, or the Nestrova platform,
              please contact us.
            </p>

            <div className="mt-6 rounded-2xl border bg-gray-50 p-6">
              <p>
                <strong>Email</strong>
              </p>

              <p className="mt-1">
                <a href="mailto:support@nestrovaai.com" className="font-semibold text-blue-600 hover:underline">support@nestrovaai.com</a>
              </p>

              <p className="mt-6">
                <strong>Average Response Time</strong>
              </p>

              <p className="mt-1">
                Within 24–48 business hours
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Business
            </h2>

            <p className="mt-3">
              Nestrova AI
            </p>

            <p>
              California, United States
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Product
            </h2>

            <p className="mt-3">
              Nestrova provides AI-powered real estate research,
              market intelligence, and educational trading research.
            </p>

            <p className="mt-4">
              The platform does not execute trades,
              provide brokerage services,
              or offer personalized financial advice.
            </p>
          </section>

        </div>
      </div>

    <div className="mx-auto mt-8 max-w-4xl">
        <SiteFooter
          showProductLinks={false}
          className="rounded-3xl border border-black/10 bg-black px-6"
        />
      </div>
    </main>
  );
}