// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllSkill: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/skills/all",
      params,
    });
  },
  createSkill: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/skills/createskill",
      body,
    });
  },
  deleteSkill: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/skills/${itemId}`,
    });
  },
};
