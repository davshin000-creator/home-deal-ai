export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">← Back to Nestrova</a>
        <h1 className="mt-6 text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 21, 2026</p>

        <div className="mt-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
            <p className="mt-2">We may collect account information such as your name, email address, user ID, saved properties, analysis history, alert settings, usage counts, and information you enter into the platform such as addresses, listing prices, and search criteria.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Payment Information</h2>
            <p className="mt-2">Payment information is processed by our payment provider. We do not store full credit card numbers on our servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">3. How We Use Information</h2>
            <p className="mt-2">We use information to operate Nestrova, provide property analysis, manage accounts, enforce usage limits, process subscriptions, send deal alerts, improve the product, and communicate with users.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Third-Party Services</h2>
            <p className="mt-2">We may use third-party services for authentication, hosting, database storage, property data, email delivery, payments, analytics, and error monitoring. These providers process data according to their own policies and our service needs.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">5. Data Retention</h2>
            <p className="mt-2">We retain user data for as long as needed to provide the service, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion of your account data by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">6. Security</h2>
            <p className="mt-2">We use reasonable technical and organizational safeguards to protect user data. However, no method of transmission or storage is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">7. Your Choices</h2>
            <p className="mt-2">You may access, update, or request deletion of certain personal information by contacting us. You may also unsubscribe from non-essential emails where applicable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">8. Contact</h2>
            <p className="mt-2">Questions about this Privacy Policy can be sent to support@nestrova.com.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
