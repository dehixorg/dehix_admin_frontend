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
  updateUserStatus: async (Id: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/project/${Id}`,
      body: {
        status,
      },
    });
  },

  getAllReports: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/report",
      params,
    });
  },
  updateReportStatus: async (Id: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/report/${Id}`,
      body: {
        status,
      },
    });
  },

  // add report
  createReport: async (data: any) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/reports",
      body: data,
    });
  },
};
