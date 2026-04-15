import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminSessions } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;

    // Clean up session from database if token exists
    if (token) {
      try {
        await db.delete(adminSessions).where(eq(adminSessions.token, token));
      } catch (error) {
        console.error("Error cleaning up session:", error);
        // Continue with logout even if session cleanup fails
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear the authentication cookie
    response.cookies.delete("admin-token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    // Even if there's an error, still clear the cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged out (with errors)",
    });
    response.cookies.delete("admin-token");

    return response;
  }
}
