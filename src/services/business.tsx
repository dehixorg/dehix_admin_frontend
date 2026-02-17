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

      endpoint: `/project/admin/business/${itemId}`,
    });
  },
  createProject: async (userId: string, projectData: any) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: `/project/${userId}/project`,
      body: projectData,
    });
  },
  updateUserStatus: async (Id: string, status: string) => {
    return apiService({
      method: Api_Methods.PATCH,
      endpoint: `/business/status`,
      body: {
        business_id: Id,
        status,
      },
    });
  },
  getBusinessHireProjects: async (businessId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `business/hire-dehixtalent/admin/${businessId}`, // Constructing the endpoint
    });
  },

  // Endpoint to get invited freelancers for a specific project
  getProjectInvitedFreelancers: async (projectId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/business/hire-dehixtalent/${projectId}/invited`,
    });
  },

  // Endpoint to get selected freelancers for a specific project
  getProjectSelectedFreelancers: async (projectId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/business/hire-dehixtalent/${projectId}/selected`,
    });
  },

  // Endpoint to get freelancers in lobby for a specific project
  getProjectLobbyFreelancers: async (projectId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/business/hire-dehixtalent/${projectId}/in-lobby`, // Assuming '/lobby' is the correct segment
    });
  },

  // Endpoint to get rejected freelancers for a specific project
  getProjectRejectedFreelancers: async (projectId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/business/hire-dehixtalent/${projectId}/rejected`,
    });
  },
  getAllFreelancerPersonalInfo: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/freelancer/admin/${itemId}`,
    });
  },

  getBusinessProjectbyId: async (itemId: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `project/project/${itemId}`,
    });
  },
};
