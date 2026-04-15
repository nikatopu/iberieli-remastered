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
    const { wineId, description, tastingNotes, image } = await request.json();

    if (!wineId) {
      return NextResponse.json(
        { error: "Wine ID is required" },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!description || !tastingNotes) {
      return NextResponse.json(
        { error: "Description and tasting notes are required" },
        { status: 400 },
      );
    }

    const updateData: any = {
      description: description.trim(),
      tastingNotes: tastingNotes.trim(),
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