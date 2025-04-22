import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profileTable } from "./user";

export const businessTable = pgTable("business", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => profileTable.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  ownerName: text("owner_name").notNull(),
  description: text("description").notNull(),
  logo: text("logo").default(""),
  location: text("location").notNull(),
  contact: text("contact").notNull(),
  website: text("website").default(""),
  industry: text("industry").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SelectBusiness = typeof businessTable.$inferSelect;
export type InsertBusiness = typeof businessTable.$inferInsert;
