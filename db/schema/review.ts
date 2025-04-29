import {
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { profileTable } from "./user";
import { forumPostTable, postTable } from "./post";
import { businessTable } from "./business";

export const reviewTable = pgTable("review", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profileTable.id, { onDelete: "cascade" }),
  postId: uuid("post_id")
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

export const businessReviewTable = pgTable("business_review", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profileTable.id, {
    onDelete: "cascade",
  }),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businessTable.id, { onDelete: "cascade" }),
  userName: text("user_name").default(""),
  rating: real("rating").default(0.0).notNull(),
  text: text("text").default(""),
  json: jsonb("json").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectBusinessReview = typeof businessReviewTable.$inferSelect;
export type InsertBusinessReview = typeof businessReviewTable.$inferInsert;

export const forumReviewTable = pgTable("forum_post_review", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profileTable.id, {
      onDelete: "cascade",
    }),
  postId: uuid("post_id")
    .notNull()
    .references(() => forumPostTable.id, { onDelete: "cascade" }),
  rating: real("rating").default(0.0).notNull(),
  text: text("text").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectForumReview = typeof forumReviewTable.$inferSelect;
export type InsertForumReview = typeof forumReviewTable.$inferInsert;
