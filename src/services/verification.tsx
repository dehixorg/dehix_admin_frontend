"use client";

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllVerification: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/verification/oracle",
      params,
    });
  },

  getAllVerificationsById: async (id: string) => {
    const endpoint = `/verification/verifier/${id}`;
    return await apiService({
      method: Api_Methods.GET,
      endpoint,
    });
  },
};
