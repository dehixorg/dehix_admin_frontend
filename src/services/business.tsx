import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

export const apiHelperService = {
  getAllBusiness: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/business",
      params,
    });
  },

  getAllBusinessPersonalInfo: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/business/${itemId}`,
    });
  },

  getAllBusinessProject: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,

      endpoint: `/project/business/${itemId}`,
    });
  },
  createProject: async (userId: string, projectData: any) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: `/project/${userId}/project`,
      body: projectData,
    });
  },
  updateUserStatus:async (Id: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/business/${Id}`,
      body: {
        status,
      },
    });
  },
};
