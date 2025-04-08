import { pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

export const Users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profileTable = pgTable("profile", {
    // Matches id from auth.users table in Supabase
    id: uuid("id")
      .primaryKey()
      .references(() => Users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    profileImage: text("profile_image"),
    dob: text("dob"),
    bio: text("bio"),
    createdAt: timestamp("created_at").notNull()
  });


export type SelectProfile = typeof profileTable.$inferSelect;
export type InsertProfile = typeof profileTable.$inferInsert;
  