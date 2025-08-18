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


 getAllVerificationsById: async (id:string) => {
 
    const endpoint = `/verification/verifier/8797685f-767e-4bc7-87b0-87c36a4509d5`;
    return await apiService({
      method: Api_Methods.GET,
      endpoint,
    });
  
},
 
};
