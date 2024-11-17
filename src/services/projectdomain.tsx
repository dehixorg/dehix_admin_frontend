// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllProjectdomain: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/projectDomain",
      params,
    });
  },
  createProjectdomain: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/projectDomain",
      body,
    });
  },
  deleteProjectdomain: async (projectDomain_id: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/projectDomain/${projectDomain_id}`,
    });
  },
};
