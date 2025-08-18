// src/services/freelancerProfile.ts

import { Api_Methods } from "../utils/common/enum";
import { apiService } from "./apiService";

export const apiHelperService = {
  getFreelancerProfileById: async (profileId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/freelancer/admin/profile/${profileId}`,
    });
  },

  
  getAllFreelancerPersonalInfo: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/freelancer/admin/${itemId}`,
    });
  },
};
