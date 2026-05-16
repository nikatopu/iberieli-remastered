import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

export const wines = pgTable("wines", {
  id: serial("id").primaryKey(),
  wineId: text("wine_id").unique().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  grapeBlend: text("grape_blend").notNull(),
  sustainability: text("sustainability").notNull(),
  certification: text("certification").notNull(),
  vegan: boolean("vegan").default(true),
  allergens: boolean("allergens").default(false),
  tastingNotes: text("tasting_notes").notNull(),
  foodRecommendation: text("food_recommendation").notNull(),
  climate: text("climate").notNull(),
  terroir: text("terroir").notNull(),
  viticulture: text("viticulture").notNull(),
  yields: text("yields").notNull(),
  vinification: json("vinification").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => adminUsers.id),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Wine = typeof wines.$inferSelect;
export type NewWine = typeof wines.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
