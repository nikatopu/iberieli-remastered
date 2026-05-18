import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contacts } from "@/lib/schema";
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

const DEFAULT_CONTACTS = [
  {
    contactId: "ordering",
    label: "Wine for Importers & Dealers",
    phone: "(+995) 599584624",
    email: "zurab@iberieli.com",
    person: "Zurab Topuridze",
    languages: "Georgian, English, Russian",
    note: null,
    visible: true,
  },
  {
    contactId: "retailing",
    label: "Wine for Retail",
    phone: null,
    email: null,
    person: null,
    languages: null,
    note: "For retail in Georgia, please visit our partner's store at topuridzewinery.ge",
    visible: true,
  },
  {
    contactId: "finances",
    label: "Finances & Invoicing",
    phone: "(+995) 599424141",
    email: "elene@iberieli.com",
    person: "Finance Department",
    languages: null,
    note: null,
    visible: true,
  },
];

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const existing = await db.select().from(contacts);

    if (existing.length === 0) {
      await db.insert(contacts).values(DEFAULT_CONTACTS);
      const seeded = await db.select().from(contacts);
      return NextResponse.json(seeded);
    }

    return NextResponse.json(existing);
  } catch (error) {
    console.error("Error fetching contacts:", error);
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
    const body = await request.json();
    const { contactId, label, phone, email, person, languages, note } = body;

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(contacts)
      .set({
        label: label ?? undefined,
        phone: phone ?? null,
        email: email ?? null,
        person: person ?? null,
        languages: languages ?? null,
        note: note ?? null,
        updatedAt: new Date(),
      })
      .where(eq(contacts.contactId, contactId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, contact: updated });
  } catch (error) {
    console.error("Error updating contact:", error);
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
    const { contactId, visible } = await request.json();

    if (!contactId || visible === undefined) {
      return NextResponse.json(
        { error: "Contact ID and visible status are required" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(contacts)
      .set({ visible: Boolean(visible), updatedAt: new Date() })
      .where(eq(contacts.contactId, contactId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, contact: updated });
  } catch (error) {
    console.error("Error toggling contact visibility:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
