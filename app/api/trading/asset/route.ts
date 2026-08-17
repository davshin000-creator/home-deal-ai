import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "This legacy mock endpoint has been disabled. Use the Nestrova Public Research Gateway.",
      code:
        "LEGACY_MOCK_DISABLED",
    },
    {
      status: 410,
    },
  );
}
