import {
  fetchAllBusiness,
  fetchBusinessById,
  insertBusiness,
  updateBusiness,
} from "@/data-access/business.db";
import { InsertBusiness } from "@/db/schema/business";
import { BusinessRequest, UpdateBusiness } from "@/types/business";

export async function saveBusiness(businessRequest: BusinessRequest) {
  try {
    const insertBusinessT: InsertBusiness = {
      adminId: businessRequest.adminId,
      name: businessRequest.name,
      ownerName: businessRequest.ownerName,
      description: businessRequest.description,
      logo: businessRequest.logo,
      location: businessRequest.location,
      contact: businessRequest.contact,
      website: businessRequest.website,
      industry: businessRequest.industry,
    };

    const id = await insertBusiness(insertBusinessT);

    return { success: true, error: "", id: id };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      id: "",
    };
  }
}

export async function getBusinessById(businessId: string) {
  try {
    const resp = await fetchBusinessById(businessId);

    return { success: true, business: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}

export async function updateBusinessById(
  businessId: string,
  updateBusinessR: UpdateBusiness
) {
  try {
    await updateBusiness(businessId, updateBusinessR);

    return { success: true, error: "" };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}

export async function getAllBusiness(userId: string) {
  try {
    const resp = await fetchAllBusiness(userId);

    return { success: true, forums: resp };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
    };
  }
}
