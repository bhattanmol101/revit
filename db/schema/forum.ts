import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profileTable } from "./user";

export const forumTable = pgTable("forum", {
  id: uuid("id").primaryKey(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => profileTable.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").default(""),
  users: uuid("users")
    .array()
    .references(() => profileTable.id),
  createdAt: timestamp("created_at").notNull(),
});

export type SelectProfile = typeof forumTable.$inferSelect;
export type InsertProfile = typeof forumTable.$inferInsert;
