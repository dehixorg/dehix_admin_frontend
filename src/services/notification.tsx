// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllNotification: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/notification/all_notification",
      params,
    });
  },
  createNotification: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/notification/createnotification",
      body,
    });
  },
  deleteNotification: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/notification/${itemId}`,
    });
  },
  updateNotificationStatus: async (labelId: string, status: string) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/notification/${labelId}`,
      body: {
        status,
      },
    });
  },
};
