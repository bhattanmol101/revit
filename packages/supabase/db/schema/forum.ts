import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profileTable } from "./user";

export const forumTable = pgTable("forum", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => profileTable.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logo: text("logo").default(""),
  isPublic: boolean("is_public").default(false).notNull(),
  industry: text("industry").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectForum = typeof forumTable.$inferSelect;
export type InsertForum = typeof forumTable.$inferInsert;

export const forumUserTable = pgTable("forum_user", {
  id: uuid("id").primaryKey().defaultRandom(),
  forumId: uuid("forum_id")
    .notNull()
    .references(() => forumTable.id, {
      onDelete: "cascade",
    }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profileTable.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectForumUser = typeof forumUserTable.$inferSelect;
export type InsertForumUser = typeof forumUserTable.$inferInsert;
