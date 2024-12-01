// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllProjectdomain: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/projectdomain",
      params,
    });
  },
  createProjectdomain: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/projectdomain",
      body,
    });
  },
  deleteProjectdomain: async (projectDomain_id: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/projectdomain/${projectDomain_id}`,
    });
  },
  updateProjectomainStatus: async (labelId: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/projectdomain/${labelId}`,
      body: {
        status,
      },
    });
  },
};
