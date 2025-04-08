import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const postTable = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull(),
  text: text("text"),
  files: text("files").array().default([]).notNull(),
  hashtags: text("hashtags").array().default([]).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectPost = typeof postTable.$inferSelect;
export type InsertPost = typeof postTable.$inferInsert;
