export default function RefundPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">← Back to Nestrova</a>
        <h1 className="mt-6 text-4xl font-bold">Refund Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 21, 2026</p>

        <div className="mt-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Subscription Refunds</h2>
            <p className="mt-2">Nestrova Pro is a monthly subscription. If you are not satisfied, contact us within 7 days of your initial purchase and we will review your refund request.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Renewals</h2>
            <p className="mt-2">Subscription renewals are generally non-refundable once a new billing period has started, unless required by applicable law or approved at our discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">3. Cancellation</h2>
            <p className="mt-2">You may cancel your subscription at any time. After cancellation, you will retain access to paid features until the end of the current billing period.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Abuse and Excessive Use</h2>
            <p className="mt-2">Refunds may be denied if there is evidence of abuse, fraud, violation of our Terms of Service, or unusually high usage of paid features during the refund period.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">5. How to Request a Refund</h2>
            <p className="mt-2">To request a refund, email support@nestrova.com with your account email, payment email, and reason for the request.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
