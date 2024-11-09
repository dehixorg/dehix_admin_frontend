// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllBid: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/bid",
      params,
    });
  },
};
