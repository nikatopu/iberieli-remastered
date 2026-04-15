import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { adminUsers, adminSessions } from "./schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId, type: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(
  token: string,
): { userId: number; type: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function createAdminUser(username: string, password: string) {
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(adminUsers)
    .values({
      username,
      passwordHash,
    })
    .returning();

  return user;
}

export async function authenticateAdmin(username: string, password: string) {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username));

  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

export async function createSession(userId: number) {
  const token = generateToken(userId);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(adminSessions).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function validateSession(token: string) {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const [session] = await db
    .select()
    .from(adminSessions)
    .where(eq(adminSessions.token, token));

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}
