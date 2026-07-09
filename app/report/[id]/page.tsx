import Link from "next/link";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

function LockedMessage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
      <section className="max-w-xl rounded-[44px] border border-white/10 bg-white/[0.07] p-8 text-center">

        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
          Report Access
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">
          {title}
        </h1>

        <p className="mt-4 text-sm leading-6 text-white/50">
          {body}
        </p>

        <div className="mt-7 flex justify-center gap-3">

          <Link
            href="/pricing"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
          >
            Upgrade Pro
          </Link>

          <Link
            href="/analyze"
            className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/65"
          >
            Back to Analyze
          </Link>

        </div>

      </section>
    </main>
  );
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, isPro } =
    await getCurrentUserProfile();

  const { id } = await params;

  if (!user) {
    return (
      <LockedMessage
        title="Sign in required."
        body="Please sign in to view your investment report."
      />
    );
  }

  if (!isPro) {
    return (
      <LockedMessage
        title="Report is a Pro feature."
        body="Upgrade to Pro to view and export full AI investment reports."
      />
    );
  }

  const supabase =
    createSupabaseAdminClient();

  const { data: report } =
    await supabase
      .from("ai_reports")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

  if (!report) {
    return (
      <LockedMessage
        title="Report not found."
        body="This report does not exist or does not belong to your account."
      />
    );
  }

  return (
    <main>

      <div className="print:hidden flex items-center justify-between bg-black p-4 text-white">

        <Link
          href="/analyze"
          className="font-semibold"
        >
          ← Back to Analyze
        </Link>

        <span className="rounded bg-white px-4 py-2 font-semibold text-black">
          Use Browser Print → Save PDF
        </span>

      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: report.report_html,
        }}
      />

    </main>
  );
}