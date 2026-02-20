import { Api_Methods } from "../utils/common/enum";
import { apiService } from "./apiService";

//KYC base Endpoint
export const KYC_ENDPOINT = "/kyc";

//Endpoint to get All kyc that are pending from businesses and freelancers
export const ADMIN_GET_PENDING_KYC = "";

//Endpoint to update KYC status based on kyc ID
export const ADMIN_UPDATE_KYC_STATUS = "/:id/status";

export const kycApiService = {
  // Get all pending KYC requests
  getAllPendingKYC: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `${KYC_ENDPOINT}${ADMIN_GET_PENDING_KYC}`,
      params,
    });
  },

  // Update KYC status by ID
  updateKYCStatus: async (id: string, status: string, role: string) => {
    const endpoint = `${KYC_ENDPOINT}/${id}/status`;
    return apiService({
      method: Api_Methods.PUT,
      endpoint,
      body: { status, role },
    });
  },

  // Get KYC by ID (if needed)
  getKYCById: async (id: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `${KYC_ENDPOINT}/${id}`,
    });
  },
};
