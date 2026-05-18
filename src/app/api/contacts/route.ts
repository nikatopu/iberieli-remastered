import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contacts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const visibleContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.visible, true));
    return NextResponse.json(visibleContacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
