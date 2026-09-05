import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { distributors } from "@/lib/schema";
import { validateSession } from "@/lib/auth";
import { countryName } from "@/data/countries";
import {
  getAllDistributors,
  ensureDistributorTable,
  normaliseUrl,
  deleteDistributor,
} from "@/lib/distributors";

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

function decorate(row: typeof distributors.$inferSelect) {
  return {
    id: row.id,
    countryCode: row.countryCode,
    countryName: countryName(row.countryCode) ?? row.countryCode,
    url: row.url,
    name: row.name,
    visible: row.visible,
  };
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    return NextResponse.json(await getAllDistributors());
  } catch (error) {
    console.error("Error fetching distributors:", error);
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
    await ensureDistributorTable();
    const { countryCode, url, name } = await request.json();

    const code =
      typeof countryCode === "string" ? countryCode.toUpperCase() : "";
    if (!countryName(code)) {
      return NextResponse.json(
        { error: "A valid country is required" },
        { status: 400 },
      );
    }

    const href = normaliseUrl(String(url ?? ""));
    if (!href) {
      return NextResponse.json(
        { error: "A valid distributor link is required" },
        { status: 400 },
      );
    }

    const [existing] = await db
      .select()
      .from(distributors)
      .where(eq(distributors.countryCode, code));

    if (existing) {
      return NextResponse.json(
        { error: `${countryName(code)} already has a distributor` },
        { status: 409 },
      );
    }

    const [created] = await db
      .insert(distributors)
      .values({
        countryCode: code,
        url: href,
        name: typeof name === "string" && name.trim() ? name.trim() : null,
      })
      .returning();

    return NextResponse.json({ success: true, distributor: decorate(created) });
  } catch (error) {
    console.error("Error creating distributor:", error);
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
    await ensureDistributorTable();
    const { id, countryCode, url, name } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Distributor ID is required" },
        { status: 400 },
      );
    }

    const code =
      typeof countryCode === "string" ? countryCode.toUpperCase() : "";
    if (!countryName(code)) {
      return NextResponse.json(
        { error: "A valid country is required" },
        { status: 400 },
      );
    }

    const href = normaliseUrl(String(url ?? ""));
    if (!href) {
      return NextResponse.json(
        { error: "A valid distributor link is required" },
        { status: 400 },
      );
    }

    const [clash] = await db
      .select()
      .from(distributors)
      .where(eq(distributors.countryCode, code));

    if (clash && clash.id !== Number(id)) {
      return NextResponse.json(
        { error: `${countryName(code)} already has a distributor` },
        { status: 409 },
      );
    }

    const [updated] = await db
      .update(distributors)
      .set({
        countryCode: code,
        url: href,
        name: typeof name === "string" && name.trim() ? name.trim() : null,
        updatedAt: new Date(),
      })
      .where(eq(distributors.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Distributor not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, distributor: decorate(updated) });
  } catch (error) {
    console.error("Error updating distributor:", error);
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
    await ensureDistributorTable();
    const { id, visible } = await request.json();

    if (!id || visible === undefined) {
      return NextResponse.json(
        { error: "Distributor ID and visible status are required" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(distributors)
      .set({ visible: Boolean(visible), updatedAt: new Date() })
      .where(eq(distributors.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Distributor not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, distributor: decorate(updated) });
  } catch (error) {
    console.error("Error toggling distributor visibility:", error);
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
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Distributor ID is required" },
        { status: 400 },
      );
    }

    const deleted = await deleteDistributor(Number(id));
    if (!deleted) {
      return NextResponse.json(
        { error: "Distributor not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting distributor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
