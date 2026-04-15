import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local for non-Next.js contexts
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  config({ path: resolve(process.cwd(), ".env.local") });
}

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
