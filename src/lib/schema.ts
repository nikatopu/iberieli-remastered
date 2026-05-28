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
  cellarName: text("cellar_name").default("Iberieli").notNull(),
  winemaker: text("winemaker").default("Zurab Topuridze").notNull(),
  alcoholLevel: text("alcohol_level"),
  inStock: boolean("in_stock").default(true).notNull(),
  certification: text("certification").notNull(),
  vegan: boolean("vegan").default(true),
  allergens: boolean("allergens").default(false),
  tastingNotes: text("tasting_notes").notNull(),
  foodRecommendation: text("food_recommendation").notNull(),
  climate: text("climate").notNull(),
  terroir: text("terroir").notNull(),
  viticulture: text("viticulture").notNull(),
  organicFarming: text("organic_farming"),
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

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  contactId: text("contact_id").unique().notNull(),
  label: text("label").notNull(),
  phone: text("phone"),
  email: text("email"),
  person: text("person"),
  languages: text("languages"),
  note: text("note"),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Wine = typeof wines.$inferSelect;
export type NewWine = typeof wines.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
