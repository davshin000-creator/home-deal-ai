export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">← Back to Nestrova</a>
        <h1 className="mt-6 text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 21, 2026</p>

        <div className="mt-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Overview</h2>
            <p className="mt-2">Nestrova is an AI-powered real estate investment analysis software platform. By using Nestrova, you agree to these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Informational Use Only</h2>
            <p className="mt-2">Nestrova provides informational software tools only. We do not provide financial advice, investment advice, legal advice, tax advice, lending advice, brokerage services, appraisal services, or real estate advisory services. You are responsible for your own decisions and should consult qualified professionals before making financial or real estate decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">3. Accounts</h2>
            <p className="mt-2">You may need to create an account to use certain features. You are responsible for keeping your account credentials secure and for all activity under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Subscriptions and Payments</h2>
            <p className="mt-2">Paid subscriptions provide access to additional features and usage limits. Subscription fees are billed according to the plan shown at checkout. Payment processing may be handled by a third-party payment provider.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">5. Data Accuracy</h2>
            <p className="mt-2">Nestrova may use third-party data, estimates, algorithms, and AI-generated outputs. We do not guarantee that any valuation, forecast, score, rent estimate, cash-flow estimate, or property data is complete, accurate, current, or suitable for your specific purpose.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">6. Acceptable Use</h2>
            <p className="mt-2">You agree not to misuse the service, attempt to bypass usage limits, scrape the service, reverse engineer the platform, interfere with security, or use Nestrova for unlawful purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">7. Limitation of Liability</h2>
            <p className="mt-2">To the maximum extent permitted by law, Nestrova is provided “as is” and we are not liable for indirect, incidental, special, consequential, or financial losses resulting from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">8. Changes</h2>
            <p className="mt-2">We may update these terms from time to time. Continued use of Nestrova after changes means you accept the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">9. Contact</h2>
            <p className="mt-2">Questions about these terms can be sent to support@nestrova.com.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
