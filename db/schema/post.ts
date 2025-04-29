import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profileTable } from "./user";
import { forumTable } from "./forum";

export const postTable = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profileTable.id, {
      onDelete: "cascade",
    }),
  text: text("text").default(""),
  files: text("files").array().default([]).notNull(),
  hashtags: text("hashtags").array().default([]).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectPost = typeof postTable.$inferSelect;
export type InsertPost = typeof postTable.$inferInsert;

export const forumPostTable = pgTable("forum_post", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profileTable.id, {
      onDelete: "cascade",
    }),
  forumId: uuid("forum_id")
    .notNull()
    .references(() => forumTable.id, {
      onDelete: "cascade",
    }),
  text: text("text").default(""),
  files: text("files").array().default([]).notNull(),
  hashtags: text("hashtags").array().default([]).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectForumPost = typeof forumPostTable.$inferSelect;
export type InsertForumPost = typeof forumPostTable.$inferInsert;
