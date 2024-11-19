// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllDomain: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/domain",
      params,
    });
  },
  createDomain: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/domain",
      body,
    });
  },

  deleteDomain: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/domain/${itemId}`,
    });
  },
  getAllDomainAdmin: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/domain/admin",
      params,
    });
  },
  updateDomainStatus: async (labelId: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/domain/${labelId}`,
      body: {
        status,
      },
    });
  },
};
