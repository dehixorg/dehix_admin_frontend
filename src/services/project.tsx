import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllProject: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/project",
      params,
    });
  },
  getSingleProject: async (projectId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/project/${projectId}`,
    });
  },
  updateUserStatus: async (Id: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/project/${Id}`,
      body: {
        status,
      },
    });
  },
};
