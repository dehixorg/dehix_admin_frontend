// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllAdmin: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/admin/all",
      params,
    });
  },

  createAdmin: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/admin/create",
      body,
    });
  },

  deleteAdmin: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/admin/${itemId}`,
    });
  },
};
