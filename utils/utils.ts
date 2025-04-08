import { redirect } from "next/navigation";

import { POST_BUCKET, POST_BUCKET_URL } from "./constants";

import { PageState } from "@/types";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function initPostState(): PageState {
  return {
    disabled: false,
    loading: false,
    success: false,
    error: null,
  };
}

// Upload file using standard upload
export async function uploadFile(uploadClient: any, file: Blob) {
  const fileExt = file.name.split(".").pop();

  const fileName = "file_" + createRandomString(10) + "." + fileExt;

  const { data, error } = await uploadClient.storage
    .from(POST_BUCKET)
    .upload(fileName, file);

  if (error) {
    return {
      success: false,
      error: error.message,
      fileUrl: "",
    };
  } else {
    const fileUrl = POST_BUCKET_URL + data.path;

    return {
      success: true,
      error: "",
      fileUrl: fileUrl,
    };
  }
}

function createRandomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}
