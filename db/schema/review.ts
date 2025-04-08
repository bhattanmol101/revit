import {
    jsonb,
    pgTable,
    real,
    text,
    timestamp,
    uuid,
  } from "drizzle-orm/pg-core";
  
  export const reviewTable = pgTable("review", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").notNull(),
    postId: uuid("postId").notNull(),
    text: text("text"),
    rating: real("rating").default(0.0).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  });
  
  export type SelectReview = typeof reviewTable.$inferSelect;
  export type InsertReview = typeof reviewTable.$inferInsert;
  