import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wines } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "@/lib/auth";

// Authentication middleware
async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const session = await validateSession(token);
  if (!session) {
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 },
    );
  }

  return null; // No error, authentication successful
}

// GET all wines (admin view)
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const allWines = await db.select().from(wines).orderBy(wines.name);
    return NextResponse.json(allWines);
  } catch (error) {
    console.error("Error fetching wines:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// UPDATE wine data (admin only)
export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const {
      wineId,
      name,
      description,
      location,
      grapeBlend,
      category,
      sustainability,
      certification,
      vegan,
      allergens,
      tastingNotes,
      foodRecommendation,
      climate,
      terroir,
      viticulture,
      yields,
      vinification,
      image,
    } = await request.json();

    if (!wineId) {
      return NextResponse.json(
        { error: "Wine ID is required" },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!name || !description || !tastingNotes) {
      return NextResponse.json(
        { error: "Name, description, and tasting notes are required" },
        { status: 400 },
      );
    }

    const updateData: any = {
      name: name?.trim(),
      description: description?.trim(),
      location: location?.trim(),
      grapeBlend: grapeBlend?.trim(),
      category,
      sustainability: sustainability?.trim(),
      certification: certification?.trim(),
      vegan: Boolean(vegan),
      allergens: Boolean(allergens),
      tastingNotes: tastingNotes?.trim(),
      foodRecommendation: foodRecommendation?.trim(),
      climate: climate?.trim(),
      terroir: terroir?.trim(),
      viticulture: viticulture?.trim(),
      yields: yields?.trim(),
      vinification: vinification || {},
      updatedAt: new Date(),
    };

    if (image !== undefined) {
      updateData.image = image;
    }

    const [updatedWine] = await db
      .update(wines)
      .set(updateData)
      .where(eq(wines.wineId, wineId))
      .returning();

    if (!updatedWine) {
      return NextResponse.json({ error: "Wine not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Wine updated successfully",
      wine: updatedWine,
    });
  } catch (error) {
    console.error("Error updating wine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
