import React from "react";

import {
  renderToBuffer,
  type DocumentProps,
} from "@react-pdf/renderer";

import type {
  ReactElement,
} from "react";

import PropertyReportPdf from "@/components/pdf/PropertyReportPdf";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { user, isPro } =
      await getCurrentUserProfile();

    if (!user) {
      return new Response(
        "Unauthorized",
        {
          status: 401,
        },
      );
    }

    if (!isPro) {
      return new Response(
        "Pro access required",
        {
          status: 403,
        },
      );
    }

    const { id } = await params;

    const supabase =
      createSupabaseAdminClient();

    const {
      data: report,
      error,
    } = await supabase
      .from("ai_reports")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "premium_pdf_report_lookup_failed",
        error,
      );

      return new Response(
        "Could not load report",
        {
          status: 500,
        },
      );
    }

    if (!report) {
      return new Response(
        "Report not found",
        {
          status: 404,
        },
      );
    }

    const documentElement =
      React.createElement(
        PropertyReportPdf,
        {
          report,
          property:
            report.property_data ?? {},
        },
      ) as unknown as ReactElement<DocumentProps>;

    const pdfBuffer =
      await renderToBuffer(
        documentElement,
      );

    return new Response(
      new Uint8Array(pdfBuffer),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="nestrova-property-report-${id}.pdf"`,

          "Cache-Control":
            "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "premium_pdf_generation_failed",
      error,
    );

    return new Response(
      "Could not generate PDF",
      {
        status: 500,
      },
    );
  }
}
