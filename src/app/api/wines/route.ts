import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wines } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wineId = searchParams.get("id");

    if (wineId) {
      const [wine] = await db
        .select()
        .from(wines)
        .where(and(eq(wines.wineId, wineId), eq(wines.visible, true)));

      if (!wine) {
        return NextResponse.json({ error: "Wine not found" }, { status: 404 });
      }

      return NextResponse.json(wine);
    } else {
      const allWines = await db
        .select()
        .from(wines)
        .where(eq(wines.visible, true));
      return NextResponse.json(allWines);
    }
  } catch (error) {
    console.error("Error fetching wines:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
