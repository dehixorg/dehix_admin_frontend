// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllFreelancers: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/freelancer/allfreelancer",
      params,
    });
  },

  getAllFreelancerPersonalInfo: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/freelancer/${itemId}`,
    });
  },
};
