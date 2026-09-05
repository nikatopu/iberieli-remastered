import { NextResponse } from "next/server";
import { getVisibleDistributors } from "@/lib/distributors";

export async function GET() {
  try {
    const list = await getVisibleDistributors();
    return NextResponse.json(list, {
      // Rarely changes, and every wine page asks for it — let the CDN help.
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching distributors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
