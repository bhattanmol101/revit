"use server";

import {
  getAllBusiness,
  getBusinessById,
  saveBusiness,
  updateBusinessById,
} from "@/api/business.api";
import { BusinessRequest, UpdateBusiness } from "@/types/business";
import { createClient } from "@/utils/supabase/server";
import { uploadFile } from "@/utils/utils";

export const saveBusinessAction = async (
  businessRequest: BusinessRequest,
  logo?: Blob
) => {
  if (logo) {
    const supabase = await createClient();

    const furesp = await uploadFile(supabase, logo);

    if (!furesp.success) {
      return {
        success: false,
        error: {
          code: 103,
          message: furesp.error,
        },
      };
    }

    businessRequest.logo = furesp.fileUrl;
  }

  const resp = await saveBusiness(businessRequest);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
    id: resp.id,
  };
};

export const fetchBusinessByIdAction = async (businessId: string) => {
  const resp = await getBusinessById(businessId);

  if (!resp.success) {
    return resp.error;
  }

  return resp.business;
};

export const updateBusinessAction = async (
  businessId: string,
  updateBusinessR: UpdateBusiness,
  logo?: Blob
) => {
  if (logo) {
    const supabase = await createClient();

    const furesp = await uploadFile(supabase, logo);

    if (!furesp.success) {
      return {
        success: false,
        error: {
          code: 103,
          message: furesp.error,
        },
      };
    }

    updateBusinessR.logo = furesp.fileUrl;
  }

  const resp = await updateBusinessById(businessId, updateBusinessR);

  return {
    success: resp.success,
    error: {
      code: 102,
      message: resp.error,
    },
  };
};

export const fetchAllBusinessAction = async (userId: string) => {
  const resp = await getAllBusiness(userId);

  console.log(resp);

  if (!resp.success) {
    return undefined;
  }

  return resp.forums;
};
