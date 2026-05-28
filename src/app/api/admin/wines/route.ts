import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wines } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "@/lib/auth";

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

  return null;
}

function generateWineId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${slug}-${suffix}`;
}

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

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      name,
      description,
      location,
      grapeBlend,
      category,
      cellarName,
      winemaker,
      alcoholLevel,
      inStock,
      certification,
      vegan,
      allergens,
      tastingNotes,
      foodRecommendation,
      climate,
      terroir,
      viticulture,
      organicFarming,
      yields,
      vinification,
      image,
    } = body;

    if (!name || !description || !tastingNotes || !category) {
      return NextResponse.json(
        { error: "Name, description, tasting notes, and category are required" },
        { status: 400 },
      );
    }

    const wineId = generateWineId(name);

    const [newWine] = await db
      .insert(wines)
      .values({
        wineId,
        name: name.trim(),
        description: description.trim(),
        location: (location || "").trim(),
        grapeBlend: (grapeBlend || "").trim(),
        category,
        cellarName: (cellarName || "Iberieli").trim(),
        winemaker: (winemaker || "Zurab Topuridze").trim(),
        alcoholLevel: alcoholLevel ? alcoholLevel.trim() : null,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        certification: (certification || "").trim(),
        vegan: Boolean(vegan),
        allergens: Boolean(allergens),
        tastingNotes: tastingNotes.trim(),
        foodRecommendation: (foodRecommendation || "").trim(),
        climate: (climate || "").trim(),
        terroir: (terroir || "").trim(),
        viticulture: (viticulture || "").trim(),
        organicFarming: organicFarming ? organicFarming.trim() : null,
        yields: (yields || "").trim(),
        vinification: vinification || {},
        image: image || "/photos/placeholder.webp",
        visible: true,
      })
      .returning();

    return NextResponse.json(
      { success: true, wine: newWine },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating wine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
      cellarName,
      winemaker,
      alcoholLevel,
      inStock,
      certification,
      vegan,
      allergens,
      tastingNotes,
      foodRecommendation,
      climate,
      terroir,
      viticulture,
      organicFarming,
      yields,
      vinification,
      image,
      visible,
    } = await request.json();

    if (!wineId) {
      return NextResponse.json(
        { error: "Wine ID is required" },
        { status: 400 },
      );
    }

    if (!name || !description || !tastingNotes) {
      return NextResponse.json(
        { error: "Name, description, and tasting notes are required" },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {
      name: name?.trim(),
      description: description?.trim(),
      location: location?.trim(),
      grapeBlend: grapeBlend?.trim(),
      category,
      cellarName: (cellarName || "Iberieli").trim(),
      winemaker: (winemaker || "Zurab Topuridze").trim(),
      alcoholLevel: alcoholLevel ? alcoholLevel.trim() : null,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      certification: certification?.trim() ?? "",
      vegan: Boolean(vegan),
      allergens: Boolean(allergens),
      tastingNotes: tastingNotes?.trim(),
      foodRecommendation: foodRecommendation?.trim(),
      climate: climate?.trim(),
      terroir: terroir?.trim(),
      viticulture: viticulture?.trim(),
      organicFarming: organicFarming ? organicFarming.trim() : null,
      yields: yields?.trim(),
      vinification: vinification || {},
      updatedAt: new Date(),
    };

    if (image !== undefined) {
      updateData.image = image;
    }

    if (visible !== undefined) {
      updateData.visible = Boolean(visible);
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

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { wineId, visible } = await request.json();

    if (!wineId || visible === undefined) {
      return NextResponse.json(
        { error: "Wine ID and visible status are required" },
        { status: 400 },
      );
    }

    const [updatedWine] = await db
      .update(wines)
      .set({ visible: Boolean(visible), updatedAt: new Date() })
      .where(eq(wines.wineId, wineId))
      .returning();

    if (!updatedWine) {
      return NextResponse.json({ error: "Wine not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, wine: updatedWine });
  } catch (error) {
    console.error("Error updating wine visibility:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const wineId = searchParams.get("wineId");

    if (!wineId) {
      return NextResponse.json(
        { error: "Wine ID is required" },
        { status: 400 },
      );
    }

    const [deletedWine] = await db
      .delete(wines)
      .where(eq(wines.wineId, wineId))
      .returning();

    if (!deletedWine) {
      return NextResponse.json({ error: "Wine not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Wine deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting wine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
