import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

export const apiHelperService = {
  getAllBusiness: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/business/all",
      params,
    });
  },

  getAllBusinessPersonalInfo: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/business/${itemId}`,
    });
  },
  getAllProject: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/project/all_projects",
      params,
    });
  },

  getAllBusinessProject: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/business/${itemId}/projects`,
    });
  },
};
