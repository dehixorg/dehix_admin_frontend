// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllFreelancers: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/freelancer",
      params,
    });
  },

  getAllFreelancerPersonalInfo: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/freelancer/admin/${itemId}`,
    });
  },
    getProjectbyId:async (Id: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/project/${Id}`,
    
    });
  },
   getProjectsByStatus: async (id: string, status: string) => {
  return apiService({
    method: Api_Methods.GET, // Or Api_Methods.GET
    endpoint: `/freelancer/${id}/project`,
    // For GET requests, pass data in a 'params' object, not 'body'.
    params: {
      status: status,
    },
  });
},
};
