// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllDomain: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/domain/all",
      params,
    });
  },
  createDomain: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/domain/createdomain",
      body,
    });
  },

  deleteDomain: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/domain/${itemId}`,
    });
  },
  getAllDomainadmin: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/domain/all/admin",
      params,
    });
  },
};
