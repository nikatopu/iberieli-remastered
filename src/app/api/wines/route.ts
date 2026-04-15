import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wines } from "@/lib/schema";
import { eq } from "drizzle-orm";

// GET all wines or specific wine by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wineId = searchParams.get("id");

    if (wineId) {
      // Get specific wine by ID
      const [wine] = await db
        .select()
        .from(wines)
        .where(eq(wines.wineId, wineId));

      if (!wine) {
        return NextResponse.json({ error: "Wine not found" }, { status: 404 });
      }

      return NextResponse.json(wine);
    } else {
      // Get all wines
      const allWines = await db.select().from(wines);
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
