// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

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
  updateVerification: async (params: { document_id: string, doc_type: string, verification_id: string, verifier_id: string }, body: { verification_status:  "PENDING" | "APPROVED" | "DENIED", comments: string }) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/verification/${params.document_id}/${params.verification_id}/${params.verifier_id}/oracle?doc_type=${params.doc_type}`,
      body: body
    })
  }
};
