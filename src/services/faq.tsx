// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllFaq: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/faq",
      params,
    });
  },

  createFaq: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/faq",
      body,
    });
  },

  deleteFaq: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/faq/${itemId}`,
    });
  },
  updateFaqStatus: async (labelId: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/faq/${labelId}`,
      body: {
        status,
      },
    });
  },
};
