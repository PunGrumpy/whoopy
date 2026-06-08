import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  accessToken: text("access_token").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  firstName: text("first_name"),
  // WHOOP User ID (stored as string)
  id: text("id").primaryKey(),
  lastName: text("last_name"),
  refreshToken: text("refresh_token").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
