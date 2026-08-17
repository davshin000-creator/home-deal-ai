import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  runResearchWatchEngine,
} from "@/lib/research/watchEngine";

export const dynamic =
  "force-dynamic";

export const runtime =
  "nodejs";

function isAuthorized(
  request: NextRequest,
) {
  const expectedSecret =
    process.env.CRON_SECRET ??
    process.env
      .ALERT_ENGINE_SECRET;

  if (!expectedSecret) {
    return false;
  }

  const authorization =
    request.headers.get(
      "authorization",
    );

  return (
    authorization ===
    `Bearer ${expectedSecret}`
  );
}

async function execute(
  request: NextRequest,
) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const result =
      await runResearchWatchEngine();

    return NextResponse.json({
      ok: true,

      executed_at:
        new Date()
          .toISOString(),

      result,
    });
  } catch (error) {
    console.error(
      "research_watch_engine_error",
      error,
    );

    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Research Watch Engine failed.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(
  request: NextRequest,
) {
  return execute(request);
}

export async function POST(
  request: NextRequest,
) {
  return execute(request);
}
