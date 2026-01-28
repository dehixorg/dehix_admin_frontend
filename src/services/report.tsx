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
      endpoint: `/reports/${reportId}/messages`, // hits general reports
      body: {
        sender,
        text,
      },
    });
  },

  // ✅ NEW: Send message to a reported message thread
  sendMessageToReportedMessage: async ({
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
      endpoint: `/admin/reported-messages/${reportId}/messages`,
      body: {
        sender,
        text,
      },
    });
  },

  // Reported Messages
  getAllReportedMessages: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/admin/reported-messages",
      params,
    });
  },

  getReportedMessageById: async (id: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/admin/reported-messages/${id}`,
    });
  },

  updateReportedMessageStatus: async (
    id: string,
    status: "OPEN" | "IN_PROGRESS" | "CLOSED",
    resolution?: string
  ) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/admin/reported-messages/${id}/status`,
      body: {
        status,
        resolution,
      },
    });
  },
};
