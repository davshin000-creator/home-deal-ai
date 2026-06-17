export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-gray-600">Last updated: June 2026</p>

        <div className="mt-8 space-y-5 text-gray-700">
          <p>
            Nestrova provides real estate investment analysis, deal discovery,
            saved deal tracking, and deal alert tools.
          </p>

          <p>
            We may collect account information, email addresses, saved property
            data, alert preferences, and usage information needed to operate the
            service.
          </p>

          <p>
            We use third-party services such as Clerk, Supabase, Render, Vercel,
            RentCast, and Lemon Squeezy to provide authentication, data storage,
            hosting, property data, and payment processing.
          </p>

          <p>
            We do not sell personal information. We only use your information to
            provide, secure, and improve the service.
          </p>

          <p>
            Real estate data and investment estimates are provided for
            informational purposes only and should not be treated as financial,
            legal, or investment advice.
          </p>

          <p>
            For questions, contact us at: support@nestrova.com
          </p>
        </div>
      </div>
    </main>
  );
}