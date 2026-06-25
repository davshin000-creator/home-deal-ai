import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Missing Supabase configuration</h1>
      </main>
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: report } = await supabase
    .from("ai_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (!report) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Report not found</h1>
        <a href="/" className="mt-4 inline-block underline">
          Back to Nestrova
        </a>
      </main>
    );
  }

  return (
    <main>
      <div className="print:hidden p-4 bg-black text-white flex justify-between items-center">
        <a href="/" className="font-semibold">← Back to Nestrova</a>
        <button
          onClick={() => {
            if (typeof window !== "undefined") window.print();
          }}
          className="rounded bg-white px-4 py-2 font-semibold text-black"
        >
          Print / Save PDF
        </button>
      </div>

      <div dangerouslySetInnerHTML={{ __html: report.report_html }} />
    </main>
  );
}
