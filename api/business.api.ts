import { fetchBusinessById, insertBusiness } from "@/data-access/business.db";
import { InsertBusiness } from "@/db/schema/business";
import { BusinessRequest } from "@/types/business";

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
