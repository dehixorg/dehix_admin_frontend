import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllInterview: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/interview",
      params,
    });
  },
};
