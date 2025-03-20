import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllConnect: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/token-request",
      params,
    });
  },

  updateConnect: async (requestId: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/token-request/${requestId}/status`,
      body: {
       status,
      },
    });
  },
  deleteConnect: async (requestId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/token-request/${requestId}`,
    });
  },

}