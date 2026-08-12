
import {
  hasResearchAccess,
} from "@/lib/research/access";

import React, {
  type ReactElement,
} from "react";

import {
  renderToBuffer,
  type DocumentProps,
} from "@react-pdf/renderer";

import ResearchReportPdf from "@/components/pdf/ResearchReportPdf";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const {
    user,
    profile,
  } =
    await getCurrentUserProfile();

  if (!user) {
    return new Response(
      "Unauthorized",
      {
        status: 401,
      },
    );
  }

  if (!hasResearchAccess(profile)) {
    return new Response(
      "Nestrova Pro required",
      {
        status: 403,
      },
    );
  }

  const {
    id,
  } = await params;

  const supabase =
    createSupabaseAdminClient();

  const {
    data: report,
    error,
  } = await supabase
    .from(
      "research_reports",
    )
    .select("*")
    .eq(
      "id",
      id,
    )
    .eq(
      "user_id",
      user.id,
    )
    .maybeSingle();

  if (
    error ||
    !report
  ) {
    return new Response(
      "Research report not found",
      {
        status: 404,
      },
    );
  }

  const element =
    React.createElement(
      ResearchReportPdf,
      {
        report,
      },
    ) as unknown as ReactElement<DocumentProps>;

  const pdfBuffer =
    await renderToBuffer(
      element,
    );

  const safeSymbol =
    String(
      report.symbol_a ||
        "research",
    )
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "-",
      )
      .toLowerCase();

  return new Response(
    new Uint8Array(
      pdfBuffer,
    ),
    {
      status: 200,

      headers: {
        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          `attachment; filename="nestrova-${safeSymbol}-${report.report_type || "research"}.pdf"`,

        "Cache-Control":
          "private, no-store",
      },
    },
  );
}
