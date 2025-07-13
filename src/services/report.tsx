import { Api_Methods } from "../utils/common/enum"; 
import { apiService } from "./apiService";

export const apiHelperService = {
 

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
      endpoint: `/reports/${Id}/status`,
      body: {
        status,
      },
    });
  },

  createReport: async (data: any) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/reports",
      body: data,
    });
  },

  getSingleReport: async (id: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/reports/${id}`,
    });
  },

  // ✅ NEW: Send message to a report
  sendMessageToReport: async ({
    reportId,
    sender,
    text,
  }: {
    reportId: string;
    sender: string;
    text: string;
  }) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: `/reports/${reportId}/messages`, // Make sure your backend uses this route
      body: {
        sender,
        text,
      },
    });
  },
};
