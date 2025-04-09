import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profileTable } from "./user";
import { postTable } from "./post";

export const reviewTable = pgTable("review", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => profileTable.id, { onDelete: "cascade" }),
  postId: uuid("postId")
    .notNull()
    .references(() => postTable.id, { onDelete: "cascade" }),
  text: text("text").default(""),
  rating: real("rating").default(0.0).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectReview = typeof reviewTable.$inferSelect;
export type InsertReview = typeof reviewTable.$inferInsert;
