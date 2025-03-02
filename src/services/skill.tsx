// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllSkill: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/skills",
      params,
    });
  },
  createSkill: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/skills",
      body,
    });
  },
  deleteSkill: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/skills/${itemId}`,
    });
  },
  getAllSkillAdmin: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/skills/admin",
      params,
    });
  },
  updateSkillStatus: async (labelId: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/skills/${labelId}`,
      body: {
        status,
      },
    });
  },
  updateSkillDesc: async (labelId: string, description: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/skills/${labelId}`,
      body: {
        description,
      },
    });
  },
};
