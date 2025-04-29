import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { businessTable, InsertBusiness } from "@/db/schema/business";
import { profileTable } from "@/db/schema/user";
import { UpdateBusiness } from "@/types/business";

export async function insertBusiness(business: InsertBusiness) {
  const res = await db
    .insert(businessTable)
    .values(business)
    .returning({ businessId: businessTable.id });

  return res[0].businessId;
}

export async function fetchBusinessById(businessId: string) {
  const rows = await db
    .select({
      id: businessTable.id,
      userId: profileTable.id,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      adminId: businessTable.adminId,
      name: businessTable.name,
      logo: businessTable.logo,
      ownerName: businessTable.ownerName,
      description: businessTable.description,
      location: businessTable.location,
      website: businessTable.website,
      contact: businessTable.contact,
      industry: businessTable.industry,
      createdAt: businessTable.createdAt,
    })
    .from(businessTable)
    .innerJoin(profileTable, eq(businessTable.adminId, profileTable.id))
    .where(eq(businessTable.id, businessId));

  return rows[0];
}

export async function updateBusiness(
  businessId: string,
  business: UpdateBusiness
) {
  const res = await db
    .update(businessTable)
    .set(business)
    .where(eq(businessTable.id, businessId))
    .returning({ businessId: businessTable.id });

  return res[0].businessId;
}

export async function fetchAllBusiness(userId: string) {
  const rows = await db
    .select({
      id: businessTable.id,
      userId: profileTable.id,
      userName: profileTable.name,
      userProfileImage: profileTable.profileImage,
      adminId: businessTable.adminId,
      name: businessTable.name,
      logo: businessTable.logo,
      ownerName: businessTable.ownerName,
      description: businessTable.description,
      location: businessTable.location,
      website: businessTable.website,
      contact: businessTable.contact,
      industry: businessTable.industry,
      createdAt: businessTable.createdAt,
    })
    .from(businessTable)
    .innerJoin(profileTable, eq(businessTable.adminId, profileTable.id))
    .orderBy(desc(businessTable.createdAt));

  return rows;
}
