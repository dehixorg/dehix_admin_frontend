// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllNotification: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/ads",
      params,
    });
  },
  createNotification: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/ads",
      body,
    });
  },
  deleteNotification: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/ads/${itemId}`,
    });
  },
  updateNotificationStatus: async (labelId: string, status: string) => {
    // Fetch the full ad data first
    const adRes = await apiService({
      method: Api_Methods.GET,
      endpoint: `/ads/${labelId}`,
    });
    if (!adRes.success) throw new Error("Could not fetch ad for update");

    const ad = adRes.data?.data;
    // Ensure importantUrl is always an array
    const importantUrl = Array.isArray(ad.importantUrl) ? ad.importantUrl : [];

    // Send all required fields with updated status
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/ads/${labelId}`,  // ID in URL path
      body: {
        // Don't include ads_id in the body, it's already in the URL
        heading: ad.heading || "",
        description: ad.description || "",
        type: ad.type || "GENERAL",
        status: status,
        background_img: ad.background_img || "",
        importantUrl: importantUrl,
      },
    });
  },
  uploadNotificationImage: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/register/upload-image",
      body,
    });
  },
};
