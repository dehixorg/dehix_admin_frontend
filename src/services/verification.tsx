// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { string } from "zod";
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


  getAllVerificationsById: async (firebaseId: string, docType?: string) => {
    const params: Record<string, string> = {};

    if (docType) {
      params.doc_type = docType;
    }
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/verification/verifier",
      params
    });

  },

};
